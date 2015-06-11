---
layout: page
title: State Mixin
id: state-mixin
section: State Mixin
---

<div class="alert alert-info">
The State Mixin will be deprecated, we recommend you use <a href="{% url /guides/containers/index.html %}"><code>containers</code></a> instead.
</div>

We found that there was a lot of boilerplate code in React components to start listening to [stores]({% url /guides/stores/index.html %}) and get their states. The State mixin helps to reduce the amount of code you have to write.

Firstly, it automatically [adds change listeners]({% url /api/stores/index.html#addChangeListener %}) to [stores you want to listen to]({% url /api/state-mixin/index.html#listenTo %}), as well as disposing of those listeners when the component unmounts.

It also introduces a new function [<code>getState</code>](#getState), which returns the state of the component. It will be called just before the initial render of the component and whenever a store updates.

{% highlight js %}
var UserState = Marty.createStateMixin({
  listenTo: ['userStore', 'friendsStore'],
  getState: function () {
    return {
      users: this.app.userStore.getUser(this.props.userId),
      friends: this.app.friendsStores.getFriends(this.props.userId)
    };
  }
});

var Users = React.createClass({
  mixins: [UserState],
  render: function () {
    return (<ul>
      {this.state.users.map(function (user) {
        return <li>{user.name}</li>;
      })}
    </ul>);
  }
});
{% endhighlight %}
