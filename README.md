# Event.db

evented kvs
(heavily under developing)

## kvs

you can set/get key-value data via tcp
date will stored in file


## broadcat

if new data saved by someone,
that will broadcasted to everyone
connected to database

```
           set foo bar                broadcast foo bar
clientA  ----------------> event.db -------------------->  clientB
```

## License

Author: Jxck
License: BSD
