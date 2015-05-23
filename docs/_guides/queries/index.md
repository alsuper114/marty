---
layout: page
title: Queries
id: queries
section: Queries
---

Queries are responsible for coordinating getting new state from outside of the application. They are identical to action creators, the difference being you use queries for **reads** and action creators for **writes**.

{% sample %}
classic
=======
var UserQueries = Marty.createQueries({
  getUser: function (id) {
    this.dispatch(UserConstants.RECEIVE_USER_STARTING, id);
    this.app.userAPI.getUser(id).then(
      function (res) {
        if (res.status === 200) {
          this.dispatch(UserConstants.RECEIVE_USER, res.body, id);
        } else {
          this.dispatch(UserConstants.RECEIVE_USER_FAILED, id);
        }
      }.bind(this),
      function (err) {
        this.dispatch(UserConstants.RECEIVE_USER_FAILED, id, err);
      }.bind(this)
    );
  }
});

es6
===
class UserQueries extends Marty.Queries {
  getUser(id) {
    this.dispatch(UserConstants.RECEIVE_USER_STARTING, id);
    this.app.userAPI.getUser(id).then(
      res => {
        if (res.status === 200) {
          this.dispatch(UserConstants.RECEIVE_USER, res.body, id);
        } else {
          this.dispatch(UserConstants.RECEIVE_USER_FAILED, id);
        }
      },
      err => this.dispatch(UserConstants.RECEIVE_USER_FAILED, id, err)
    );
  }
}

module.exports = UserQueries;
{% endsample %}

##Why have Queries at all?

One practical reason for queries is that you get a circular dependency if your store tries to call an action creator from inside itself. Splitting reads from writes was an easy way of resolving this situation. You could just as easily use action creators, but we've found having separate types for them makes the code base easier to navigate and understand.

