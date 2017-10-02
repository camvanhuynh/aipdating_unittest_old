describe('authentication service', function() {

  var authentication;
  var httpBackend;

  beforeEach(angular.mock.module('aipdatingApp'));

  beforeEach(inject(function($httpBackend, _authentication_) {
    httpBackend = $httpBackend;
    authentication = _authentication_;

    //Mock the time so that the token is not expired
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2017, 9, 30));
  }));

  afterEach(function() {
    jasmine.clock().uninstall();
    //authentication.user = null;
  })

  it('should log user in', function() {
      console.log("Case 1: Log valid user in")
      var url = 'http://localhost:5000';
      var validUser = {
        email: "unit@test",
        password: "abc"
      }

    httpBackend.when('POST','/auth/login',validUser)
    .respond(200,{token:'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWM3NDUyZTBmMGE0NmNmMTE2MTFlMmIiLCJlbWFpbCI6InVuaXRAdGVzdCIsIm5hbWUiOiJVbml0VGVzdCIsInJvbGUiOiJNZW1iZXIiLCJpYXQiOjE1MDY4NjE2MzIsImV4cCI6MTUyNTU2MTYzMn0.Ajjbjmkt9-L3nVX3lNW7R99h9-Yw0ZmRgxMRfrhg2s8',
    user: { _id: '59c7452e0f0a46cf11611e2b',email: 'unit@test', name:'UnitTest',role: 'Member' },});

    authentication.login(validUser);
    httpBackend.flush();
    expect(authentication.currentUser().name).toEqual("UnitTest");

  });


  it('should log user in', function() {
      console.log("Case 2: Should NOT log invalid user in");
    
      var url = 'http://localhost:5000';
      var invalidUser = {
        email: "unit123@test",
        password: "abc"
      }

    httpBackend.when('POST','/auth/login',invalidUser)
    .respond(401,{error: 'Unauthorized user', token: '', user: {}});

    authentication.login(invalidUser);
    httpBackend.flush();

    expect(authentication.currentUser()).toEqual(null);

  });

})
