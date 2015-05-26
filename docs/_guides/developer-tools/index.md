---
layout: page
title: Developer Tools
id: devtools
section: Dev tools
---

[Marty Developer Tools](https://chrome.google.com/webstore/detail/marty-developer-tools/fifcikknnbggajppebgolpkaambnkpae) is an extension to Chrome's developer tools. It shows you the current state of your stores, actions that have flowed through the application as well as allowing you to revert to an earlier state. For each action we will show:

* Which stores handled the action
* What arguments were passed to the stores action handler
* What components re-rendered as a result of the action (and how many)
* Which stores caused a component to re-render

<a href="{% url /img/devtools-data-flow.png %}"><img src="{% url /img/devtools-data-flow.png %}" width="100%" alt="Marty Developer Tools"/></a>

For Marty Developer Tools to work, you add Marty to the window object (<code>window.Marty = require('marty')</code>). Once you've done that, open your app in Chrome and open Chrome Developer Tools. You should see a new 'Marty' tab which gives you a view into what your application is doing.

<h2 id="marty-native">Using DevTools with marty-native</h2>

To use DevTools with `marty-native` (Or any other place outside of Chrome) you need to first install `marty-devtools` on the command line and then make sure its running.

```bash
npm install -g marty-devtools
marty-devtools
```

Next, install `marty-devtools-observer` in your application and call the observer at start up.

```js
var Marty = require('marty');
var observe = require('marty-devtools-observer');

observe(Marty);
```

Finally, open Chrome and go to `http://localhost:7070/?port=5858`. You should then see whats happening in your application.

<h2 id="serializers">Serializers</h2>

Marty Developer Tools uses [``window.postMessage``](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to communicate with Marty. This means you need to serialize any state to simple objects otherwise the developer tools won't be able to receive it. We try our best (e.g. We automatically serialize [immutable.js](http://facebook.github.io/immutable-js/)) collections for you however there will be times when you want more control. For these cases you can register a new serializer

{% highlight js %}
window.MartyDevTools.registerSerializer({
  id: 'foo',
  canSerialize(obj) {
    return obj instanceof Foo;
  },
  serialize(obj) {
    return obj.serialize();
  }
})
{% endhighlight %}

