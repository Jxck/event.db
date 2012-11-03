# Event.db

[![Build Status](https://secure.travis-ci.org/Jxck/event.db.png)](http://travis-ci.org/Jxck/event.db)

evented kvs
(heavily under developing)

## motivation

In realtime web, We want to hook the change of Data(State).
So you need a messaging system to do that.

For example, PubSub is used by this offer.
You sets up some message queue server like ZeroMQ,
or use Redis for storing.

but in these way, you need to do TWO thing at same time.

1, storing data.
2, publishing data.


```
                       save data
client ----> Server -------> database
               |
               |  queueing data
               v
            MQServer
             / | \
           /   |   \   publish to everyone
         /     |     \
       /       |       \
      v        v        v
   client   client    client
```

(Redis could store data, but basically on memory.)

but if you use Event.db in this case,
You need to do is only 1.

because Event.db publish data, after storing data.

```
 client ---> Server
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


## kvs

You can set/get key-value data via tcp.
Date will stored in file (not volatile, persistence).

The size of key value are fixed.
you can setting that size by Configration File.

In my experience, almost of all message
used in Realtime Apllication is small.
(140byte tweets, 16byte sessionid etc)

So, Event.db dosen't support variable size.
And this makes read/write faster.

You may say, "thats wastes a file size".
I think so too, but Event.db will be able to
scale out via consistent hashing.
you can seve data in separate file.
Also, file size may not be big problem in thease days.
The speed of read/write is critical problem than waste of resource,
especially in RealTime Apps :)


## API

I'm going to support two way.

- Memcache Protocol
- MessagePack RPC

Every data will store to file by MessagePacked format.


## broadcat

If new data saved by someone,
that will broadcasted to everyone,
connected to database.


## how to use

```shell
$ bin/index.js --config /path/to/config
```

```shell
$ telnet 127.0.0.1
set foo bar
STORED
get foo
bar
```


## License

Author: Jxck
License: BSD
