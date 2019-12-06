const stringGenerator = require('randomstring')
const mysql = require('mysql2')
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'cloud429.mxserver.ro',
  port: '26',
  auth: {
    user: 'chieftain@hustlertribes.com',
    pass: 'BI5K}#KlzzfK'
  }
});

var connection = mysql.createConnection({
    host: "hustlertribes.com",
    database: "hustlertribes_db",
    user: "hustlertribes_admin",
    password: "LcFit.-5N)_X"
});
connection.connect(function(error) {
    if (error) {
      console.log(error);
      return;
    }
   
    console.log('Successfully connected to the database!');
});

module.exports = {
    generateReferralCode: function () {
        return stringGenerator.generate(7).toUpperCase()
    },

    signupUser: function(sql) {
        connection.query(sql, function(error, results) {
            if(error) {
                return error.errno
            }

            return 200
        })
    },

    checkIfUserAlreadyExists: function(email) {
        sql = `SELECT * FROM users WHERE email = "${email}"`

        return new Promise(function(resolve, reject) {
            connection.query(sql, function(error, results) {
                if(error) {
                    console.log(error)
                } else if(results.length > 0) {
                    resolve({
                        userExists: 1
                    })
                } else {
                    resolve({
                        userExists: 0
                    })
                }
            })
        })
    },

    getUserIdWithReferralCode: function(referralCode) {
        sql = `SELECT id, referrals_left FROM users WHERE referral_code = "${referralCode}"`
        
        return new Promise(function(resolve, reject) {
            connection.query(sql, function(error, results) {
                if(error) {
                    console.log(error);
                } else if(results.length > 0) {
                    resolve({
                        userid: results[0].id,
                        userLeftReferrals: results[0].referrals_left
                    })
                } else {
                    resolve({
                        userid: 0,
                        userLeftReferrals: 0
                    })
                }
            })
        })
    },

    decreaseAllowedReferralsForUser: function(referralCode) {
        sql = `UPDATE users SET referrals_left = referrals_left - 1 WHERE referral_code = "${referralCode}"`

        return new Promise(function(resolve, reject) {
            connection.query(sql, function(error, results) {
                if(error) {
                    resolve({
                        executionStatus: error.errno
                    })
                } else if(results.affectedRows > 0) {
                    resolve({
                        executionStatus: 200
                    })
                } else {
                    resolve({
                        executionStatus: 0
                    })
                }
            })
        })
    },

    addNewUserToDatabase: function(email, newsletter, privacypolicy, country, referredBy, referralCode) {
        var sql = "INSERT INTO users (email, newsletter, privacypolicy, country, referred_by, referral_code, user_role)"
        sql += `VALUES ("${email}", ${newsletter}, ${privacypolicy}, "${country}", ${referredBy}, "${referralCode}", 1)`

        var emailMessage = ""
        if(referralCode != "") {
            emailMessage = 'Thanks for joining a growing tribe of hustlers like yourself! You’re awesome✌️<br><br>Here is your unique invite link: ' + referralCode + '<br><br>Up to 3 people can sign up through this link, so use it wisely. 🤓<br><br>We want to maintain a good tribe quality with hustlers like you, so please invite people who you would host on your couch. 🛋️<br><br>If you run out of invites drop us a line and let’s talk about freeing up some more. ✉️<br><br>If you have any questions or feedback don’t hesitate to reach out! 🙋'
        } else {
            emailMessage = 'Thanks for your interest in joining Hustlertribes, a growing tribe of global hustlers like yourself! You’re awesome✌<br><br>You’re one of the very early adopters who is now on the waitinglist and will receive an email when we launch. Meanwhile stay in touch with us on Facebook and Twitter (launching soon!).<br><br>Don’t forget: if you can find someone with an available access code you can get on the early-access list! Feel free to ask around in your local entrepreneur community.<br><br>If you have any questions or feedback don’t hesitate to reach out! 🙋'
        }

        return new Promise(function(resolve, reject) {
            connection.query(sql, function(error, results) {
                if(error) {
                    console.log(error)
                    resolve({
                        executionStatus: error.errno
                    })
                } else if(results.affectedRows > 0) {
                    var mailOptions = {
                        from: '"Hustler Tribes" <chieftain@hustlertribes.com>',
                        to: email,
                        subject: 'Thank you for registering!',
                        html: emailMessage
                      };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });
                    resolve({
                        executionStatus: 200
                    })
                } else {
                    resolve({
                        executionStatus: 0
                    })
                }
            })
        })
    }
}