## Assumptions Used

(i) Snapshare has 10 million reistered users

(ii) 10% of registered users are active each day, so there are 1000,000 daily active users

(iii) Each Active user uploads 1 photo per day

(iv) Each Active user views 50 feed pages per day

(v) The average original photo is 2MB and also one 50KB thumbnail

(vi) Peak traffic is assumed to be 5x the average traffic

(vii) The stated daily activity is spread evenly across 24 hours of the day

(viii) For capacity estimates, we use 365 days per year

(ix) No extra copies, database overhead, backups, or replication are included in the basic storage calculation.

## Daily Active Users

Daily Active Users (DAU) = 10,000,000 registered users × 10% Active users

DAU = 10,000,000 × 0.10 = 1,000,000 Daily Active Users

## Estimate of Uploads per second

Each of 1 Million DAU uploads 1 photo per day

Uploads per day = 1,000,000 × 1 = 1,000,000 uploads/day

Seconds in a day ≈ 86,400 (rounded to 100,000 for easy calculation)

Average uploads per second: 1,000,000 ÷ 100,000
= 10 uploads/sec

Peak uploads per second using 5×: 10 × 5 = 50 uploads/second


## Feed views per second

Each DAU views 50 feed pages per day: 1,000,000 × 50 = 50,000,000 views/day

Average views per second: 50,000,000 ÷ 100,000 = 500 feed views/second

Peak feed views per second = 500 × 5 = 2500 feed views/second

## Storage  Per Year

DAU uploads 1 photo/day: 1 × 1,000,000 = 1,000,000 photos uploads/day

Original photos: 1,000,000 × 2MB = 2,000,000 MB/day ≈ 2TB/day

Thumbnails: 1,000,000 × 50 KB = 50,000,000 KB ≈ 50 GB = 0.05 TB

Total New storage per day: 2 TB + 0.05 TB = 2.05 TB/day

Storage per year: 2.05 TB × 365 ≈ 748.25 TB/year

## Read-heavy or Write-heavy

**Snapshare** is read heavy. There are about 500 feed reads per second on an average compared to 10 photo uploads per second, and a peak is about 2500 reads/second versus 50 uploads/second, meaning the design should prioritize handling large numbers of views efficiently.

In particular, SnapShare should use CDN caching for photos, application-level caching for frequently requested feed data, and a database read replica so that read traffic does not overload the primary database. App servers should also be horizontally scalable so more servers can be added as traffic increases.

## Why Photos Should Not Be Stored in the Database

The actual photo files should not be stored as database BLOBs because photos are large, would make the database much larger, increase backup and replication costs, consume database resources for file delivery, and make scaling photo storage independently from application data difficult.

Instead, original photos and thumbnails should be stored in object storage such as an S3-style object-storage service. The database should store metadata such as the photo ID, owner, upload time, object-storage key/URL, and thumbnail reference. Object storage is designed for large files and can scale to very large capacities, while a CDN can efficiently deliver frequently viewed images from edge locations.

## Architecture Diagram

                         ┌──────────────────┐
                         │      Users       │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │       CDN        │
                         │ cached images /  │
                         │ static content   │
                         └────────┬─────────┘
                                  │ cache miss / API    requests
                                  ▼
                         ┌──────────────────┐
                         │  Load Balancer   │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
             ┌──────▼─────┐ ┌────▼──────┐ ┌────▼──────┐
             │ App Server │ │ App Server│ │ App Server│
             │     1      │ │     2     │ │     N     │
             └──────┬─────┘ └────┬──────┘ └────┬──────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
             ┌──────▼──────┐             ┌──────▼────────┐
             │    Cache    │             │    Primary    │
             │ feed/data   │             │   Database    │
             └──────┬──────┘             └──────┬────────┘
                    │                           │
                    │                    replication
                    │                           │
                    │                    ┌──────▼────────┐
                    │                    │   Read Replica│
                    │                    └───────────────┘
                    │
                    │
             ┌──────▼──────────────┐
             │    Object Storage   │
             │ originals +         │
             │ thumbnails          │
             └─────────▲───────────┘
                       │
                       │ thumbnail output
                ┌──────┴──────┐
                │    Queue    │
                └──────┬──────┘
                       │
                ┌──────▼──────┐
                │   Worker    │
                │ thumbnail   │
                │ generation  │
                └─────────────┘



## Components

**Users**: People who use snapshare application

**CDN**: Serves frequently requested photos from locations close to users, reducing latency and protecting the application servers and object storage from repeated image requests.

**Load balancer**: Distributes incoming requests across app servers so no single server becomes a bottleneck and failed servers can be removed from service.

**App servers**: Run SnapShare's application logic, authenticate users, process uploads, construct feeds, and coordinate access to the cache and databases.

**Cache**: Keeps frequently accessed feed data and other hot information in fast memory, reducing repeated database reads.

**Primary database**: Stores durable structured data such as users, follows, photo metadata, and feed-related information and handles writes.

**Read replica**: Provides additional database capacity for read-heavy feed queries without placing all read load on the primary database.

**Object storage**: Stores the large original photos and thumbnails cheaply and durably without bloating the relational database.

**Queue**: Buffers thumbnail-generation jobs so uploading a photo does not have to wait for image processing to finish.

**Worker**: Consumes queued jobs and generates the 50 KB thumbnails asynchronously before storing them in object storage.

## Photo Upload Flow

1. The user selects a photo in the SnapShare application and sends an authenticated upload request.
2. The load balancer routes the request to an available app server.
3. The app server validates the user, file type, size, and other upload requirements.
4. The original photo is uploaded to object storage, using a unique object key such as the photo ID.
5. The app server records the photo's metadata and object-storage location in the primary database.
6. The app server places a thumbnail-generation job containing the photo/object-storage reference onto the queue.
7. The app server can return success to the user without waiting for thumbnail creation, making the upload path faster.
8. A worker takes the job from the queue and downloads or accesses the original photo from object storage.
9. The worker creates the 50 KB thumbnail.
10. The worker stores the thumbnail in object storage.
11. The thumbnail becomes available through the CDN, where it can be cached and served efficiently to users viewing feeds.

## Trade-offs
(i) Cache freshness vs. Performance
Caching feed data greatly reduces database load and improves response times, but cached data can become stale. A shorter cache lifetime gives fresher feeds but increases database traffic, while a longer lifetime improves performance but may delay the appearance of newly uploaded photos or changes in follow relationships.

(ii) Asynchronous thumbnails vs. immediate consistency
Generating thumbnails through a queue and worker makes uploads faster and protects the upload path from expensive image processing. However, there is a short period after an upload where the thumbnail may not yet exist, so the system must handle this temporary inconsistency gracefully.

(iii) Read replica vs. consistency
A read replica increases read capacity and is useful for SnapShare's read-heavy workload, but replication can introduce a small delay. A user might therefore briefly read slightly older data from the replica after performing a write, while querying the primary when strong read-after-write consistency is required.

(iv) CDN cost vs. origin load
Using a CDN reduces latency and dramatically decreases repeated requests reaching object storage, but CDN usage introduces additional cost and cache-management complexity. It is worthwhile because photo delivery is expected to dominate the system's read traffic.