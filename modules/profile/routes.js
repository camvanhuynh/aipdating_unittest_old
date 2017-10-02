//This javascript file is responsible for controlling the handling of transfer
//between client and server

var router = require('express').Router(),
    Profile = require('./models/profile'),
    passport = require('passport'),
    passportService = require('../../config/passport');

// requireAuth = passport.authentication('jwt',{ session:false });
//var  requireLogin = passport.authentication('local', { session:false });

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

  //Server obtaining the profile information sent by the client
  //so that it can be listed
router.get('/list', requireAuth, function(req, res) {
  Profile.find({}, function(err, profiles) {
    if(err)
      res.send(err);
    res.json(profiles);
  });
});

//Adding the profile to the list
router.post('/add' ,function(req, res) {
  var profile = new Profile(req.body);
  profile.save(function(err, insertedProfile) {
    if(err) {
      return res.status(400).send({
        message: err
      })
    }
    res.status(200).send({
      profile: insertedProfile
    });
  });
});

//Removing the profile from the list
router.delete('/:profileId/delete', function(req, res) {
  Profile.remove({ _id: req.params.profileId}, function(err,result) {
    if(err) {
      return res.status(400).send({
        message: err
      });
    }
    res.sendStatus(200);
  })
});

//Editing the existing profile
router.put('/:profileId/edit', function(req, res) {
  Profile.update(
    {
      _id: req.params.profileId
    },
    req.body,
    function(err,result) {
      if(err) {
        return res.status(400).send({
          message: err
        });
      }
      res.sendStatus(200);
    }
  );
});

module.exports = router;
