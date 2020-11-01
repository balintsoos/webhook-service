# webhook-service
> Notify integration partners about events

## Tech Stack

* Node.js + Typescript
* MongoDB
* RabbitMq
* Docker

## How to use

### Start everything up:
```
$ make up
```

### Subscribe to an event:
Send a `POST` request to `http://localhost:8080/subscriptions` with a payload like this:
```json
{
  "event": "order",
  "partner": 1,
  "address": "http://web:8080/test"
}
```

### Send an event:
You can open up the [RabbitMQ Management Console](http://localhost:15672) (username and password is `guest`) and publish messages into the `events` queue, for example:
```json
{
  "type": "order",
  "partner": 1,
  "data": { "foo": "bar" }
}
```

### Run E2E tests:
```
$ make test
```

## Still has much room for improvement, for example

* more E2E testing, especially the business logic inside the workers

* unit testing of modules

* handle constantly failing webhooks with exponential backoff and/or retry limit and eventually disable them ([a good read](https://www.alphasights.com/news/exponential-backoff-with-rabbitmq?locale=en))

* validate payload on `/subscriptions` endpoint

* authentication & authorization

* start workers after rabbitmq is properly up (use `wait-for-it.sh` instead the current `restart: on-failure`)

## lots of ideas came from these sources:

* https://glaforge.appspot.com/article/implementing-webhooks-not-as-trivial-as-it-may-seem

* https://shopify.dev/docs/admin-api/rest/reference/events/webhook
