const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const utilities = require('./utilities')

const app = express()

app.use(cors())
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/signup_user', function (req, res) {
    var email = req.body.email
    var newsletter = req.body.newsletter
    var privacypolicy = req.body.privacypolicy
    var country = req.body.country
    var referralCode = utilities.generateReferralCode()
    var referralCodeUsed = req.body.refcode

    if (referralCodeUsed == "") {
      referralCodeUsed = "0000000"
      referralCode = ""
    }
    if(newsletter == "") {
      newsletter = 0;
    }

    if(!country) {
        country = "UNKNOWN"
    }

    userAlreadyExists = utilities.checkIfUserAlreadyExists(email)
    userAlreadyExists.then(function(databaseUser) {
        if(!databaseUser.userExists) {
          if(referralCodeUsed != "0000000") {
            getUser = utilities.getUserIdWithReferralCode(referralCodeUsed)
            getUser.then(function(userData) {
                if(userData.userid && userData.userLeftReferrals) {
                    updateReferringUser = utilities.decreaseAllowedReferralsForUser(referralCodeUsed)
                    updateReferringUser.then(function(updateResult) {
                        if(updateResult.executionStatus == 200) {
                            addUserStatus = utilities.addNewUserToDatabase(email, newsletter, privacypolicy, country, userData.userid, referralCode)
                            addUserStatus.then(function(finalResult) {
                                if(finalResult.executionStatus == 200) {
                                    res.status(200).send("You have registered successfully!")
                                } else {
                                    res.status(200).send("An unknown error occurred!")
                                }
                            })
                        }
                    })
                } else {
                    res.status(200).send("The referral code used is invalid!")
                }
            })
          } else {
            addUserStatus = utilities.addNewUserToDatabase(email, newsletter, privacypolicy, country, 0, referralCode)
              addUserStatus.then(function(finalResult) {
                if(finalResult.executionStatus == 200) {
                  res.status(200).send("You have been added to the waiting list!")
                } else {
                  res.status(200).send("An unknown error occurred!")
                }
            })
          }
        } else {
            res.status(200).send("This email address is already registered!")
        }
    })
})

app.listen(3000)