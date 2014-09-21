Bootfile Configuration Storage [![Build Status](https://travis-ci.org/spidapp/spid-storage-configuration-bootfile.svg?branch=master)](https://travis-ci.org/spidapp/spid-storage-configuration-bootfile)
=========================================

Configuration storage used at boot-time to load the `storage` value that specify the real-storage backend.

**The Bootfile Configuration Storage is not suited for a use of Spid in a distributed architecture**

Since the Bootfile rely on the filesystem, changes cannot be propagated to Spid instances running on other machines.
