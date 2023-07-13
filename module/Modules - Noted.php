<?php
//@ Hapi Plugin dan Data Validation
//? membuat sebuah fungsi/class untuk digunakan sebagaimana fungsinya
//~ Data Validation
//? memastikan client send a request sesuai (SQL Injection)
//? validasi data lebih baik dari sisi backend (server)
//~ Joi
//? tool javascript untuk membantu validasi data
//~ Custom Error
//@ Database dengan amazon RDS
//? relational-database; database yg umum digunakan (tradisonal) mysql,sql dll
//? non-relational database; penyimpanan yang diotomatisai seperti key value, document, graph (Nosql/not only sql)
//~ Relational Database
//? disimpan dlm bentuk table tauple (row) dan atribute (column)
//? table junction; table relasi antara 2 table (table pivot)
//~ Node Prosegres
//? Client-connection; digunakan untuk applikasi yang jrg akses database
//? pool-connection; untuk aplikasi yang sering gunakan database
//? node-pg-migrate; melakukan operasi database menggunakan javascript;
//@ Authentication
//? prosess validasi untuk identifikasi dalam sebuah aplikasi
//~ Scema Authentication:
//? Basic Authentication; password yg di encode base64 string, kurang baik, tp akan lbh baik jka pakai https protocol karena stiap post akan di encrypt
//? API Key; key rahasia yang dilampikan pada custom header, tp jika sudah tau keynya mereka bsa dpt authentication
//? Token/Bearer Authentication; OAuth2, token yg memiliki kadaluarsa yang dpt berubah2
//~ Token-Based Authentication
//? format token yang banyak digunakan pada Token-Based Authentication
//? Server menjadi stateless (tidak menyimpan state);  karena kita tidak perlu menyimpan session di dalam server.
//? Dapat digunakan di mana saja; authentication dapat digunakan di banyak server selama memiliki sistem tokenisasi yang sama cocok untuk microservice.
//? Mendapatkan kontrol akses penuh; memiliki payload atau data yang dapat kita manfaatkan untuk menulis data sesuai kebutuhan
//~ JWT ( JSON Web Token)
//? memiliki 3 signature; heaer, payload dan signature
//# Header; metadata jenis token dan algolirtma hasing untuk membuat signature token (decode)
//# Payload; dsbut claims, data dari pengguna (nama, email, audience token dll)
//? iss (issuer) : Mengindikasikan pihak yang menerbitkan JWT token.
//? sub (subject) : Mengindikasikan pihak yang menjadi subject JWT token.
//? aud (audience) : Mengindikasikan pihak yang menerima JWT token.
//? exp (expire) : Mengindikasikan waktu kedaluwarsa JWT token.
//? nbf (not before) : Mengindikasikan waktu kapan JWT token bisa digunakan.
//? iat (issued at) : Mengindikasikan waktu diterbitkannya JWT token.
//# Signature; token yang memiliki kode rahasia, formula token dari Header+Payload+Kode rahasia
//~ Pola Token-based Authentication
//? 1. client input email/pass -> ( dapat access token yang memiliki kadaluarsa) 
//? 2. memberikan access token & refresh token ()
//? 3. save refresh token ke db
//? 4. save access token & refresh token ke local storage
//? 5. jika client ingin access data, dia harus lampikran access token
//? 6. client dapat access data
//? 7. get access token baru dgn lampirkan refresh token ( agar tidak login2 lg)
//! run cmd: node -> require('crypto').randomBytes(64).toString('hex'); untuk get signature
//@ Authorization
//? proses validasi setiap pengguna berhak untuk mengakses resource
//@ Normalisasi Database
//? proses pembentukan skema db untuk keektivitasan data dan performa ( mengurangi redundancy)
//? Redundancy; kejadian di mana data yang sama disimpan di lebih dari 2 tempat ( di table a iya dan table b juga atau column dgn sparator comma)
//~ Aturan Normalisasi Database
//# 1NF (First Normal Form): Setiap kolom tidak boleh memiliki nilai lebih dari satu.
//? tidak boleh ada sparated dlm satu kolom
//# 2NF (Second Normal Form): Semua kolom yang bukan merupakan suatu key (non-attributed key) harus bergantung secara penuh dengan satu primary key.
//? dipisah menjadi table lain, untuk digabungkan dgn PK
//? jika many-to-many lebih baik dipisahkan menjadi table junction (pivot), set constraint prakteknya foreign key
//# 3NF (Third Normal Form): Tidak boleh ada kolom yang transitive functional dependencies
//? misal dlm satu table ada nama_jbtn -> gaji, harus dipecah menjadi id_jabatan -> nama_jbtn -> gaji
//~ Jenis-Jenis Join Tabel
//? INNER JOIN : Mengembalikan nilai yang cocok (matching) dari kedua tabel.
//? LEFT (OUTER) JOIN : Mengembalikan semua data dari tabel kiri, dan data yang cocok (matching) dari tabel kanan
//? RIGHT (OUTER) JOIN : Mengembalikan semua data dari tabel kanan, dan data yang cocok dari tabel kiri.
//? FULL (OUTER) JOIN : Mengembalikan semua data yang cocok baik dari tabel kiri maupun tabel kanan
//# Foreign Key; merefrensikan suatu kolom pada tble tertentu ke dalam table lain (tidak boleh bernilai selain dari refrensi kolom atau kosong)
//@ Message Broker dengan Amazon MQ
//? komponen yang memungkinkan aplikasi, sistem, serta service untuk berkomunikasi satu sama lain dan bertukar informasi (asyncronous)
//? menghilangkan ketergantungan antar komponen dan mengurangi beban server
//? rabbitMQ adalah aplikasi untuk message broker yang bertugas untuk menerima dan mengirimkan pesan
//# berbeda dengan API yang hanya bertukar data dengan syncronous
//# idel untuk ecommerce karena memiliki banyak requst dalam waktu yg berdekatan
//~ Pola Distrubusi Message Broker
//? Point-to-point messaging: pola distribusi yang digunakan dalam message queue dengan hubungan one-to-one antara pengirim dan penerima pesan
//? Publish/subscribe messaging; pola distribusi yang dikirimkan ke suatu topic (broadcast), dan (brodcast) akan memgorim pesan yang membutuhkan (sub)
//~ Rabbit MQ
//? yg mendukung protokol standart (AMPQP, STOMP, MQTT, HTTP, dan WebSocket)
//# rabbitmq-plugins.bat enable rabbitmq_management ( activated plugin )
//# rabbitmq-server ( activated server )
//# http://localhost:15672/ (guest;guest)
//? Producing: Aktivitas dalam mengirimkan messages. Pihak atau program yang mengirimkan messages disebut dengan producer.
//? Queue: Sebuah kotak pos yang berada di RabbitMQ server dan dapat menampung banyak messages. Meskipun dapat menampung banyak messages, queue tetap memiliki batas, terlebih bila messages mengandung buffer yang besar.
//? Consuming: Aktivitas dalam menerima messages. Pihak atau program yang menerima messages disebut dengan consumer. Consumer selalu memantau queue yang ada di server RabbitMQ selama ia tersedia atau dapat menerima pesan. Berikut adalah gambar dari dasar alur kerja message broker menggunakan RabbitMQ.
//~ Amazon MQ
//? layanan message broker terkelola untuk Apache ActiveMQ dan RabbitMQ