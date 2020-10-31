# webhook-service
> Notify integration partners about events

## Tech Stack

* Node.js + Typescript
* MongoDB
* RabbitMq
* Docker

## How to use

```
$ make up
```

## Time

6-7 hours total in about 3 days (including the writing of this README)

## Still has much room for improvement like

* handle constantly failing webhooks with exponential backoff and/or retry limit and eventually disable them ([a good read](https://www.alphasights.com/news/exponential-backoff-with-rabbitmq?locale=en))

* validate payload on `/subscriptions` endpoint

* authentication and authorization

* unit testing of modules

## Examples
useful for manual testing

Subscription request body:
```json
{
  "partner": 1,
  "address": "http://web:8080/test",
  "event": "order"
}
```

Event message content:
```json
{
  "partner": 1,
  "type": "order",
  "data": { "foo": "bar" }
}
```

Notification message content:
```json
{
  "address": "http://web:8080/test",
  "payload": { "event": {...} },
  "signature": "zqGJpeN..."
}
```

## lots of ideas came from these sources:

* https://glaforge.appspot.com/article/implementing-webhooks-not-as-trivial-as-it-may-seem

* https://shopify.dev/docs/admin-api/rest/reference/events/webhook
