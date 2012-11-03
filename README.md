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
              you
               |  save data
               v
            event.db
             / | \
           /   |   \     broadcast to everyone
         /     |     \   connecting to event.db
       /       |       \
      v        v        v
   client   client    client
```

## License

Author: Jxck

License: BSD
