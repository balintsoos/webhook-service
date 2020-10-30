# webhook-service
Notify integration partners about events




https://glaforge.appspot.com/article/implementing-webhooks-not-as-trivial-as-it-may-seem


exponential backoff
+
retry limit
+
dead letter queue

https://www.alphasights.com/news/exponential-backoff-with-rabbitmq?locale=en


validate subscriptions endpoint payload


authentication and authorization


unit testing for module and lib

Subscription:
```json
{
  "partner": 1,
  "address": "http://localhost:3000/test",
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
  "address": "http://localhost:3000/test",
  "payload": { "foo": "bar" },
  "signature": "zqGJpeN..."
}
```
