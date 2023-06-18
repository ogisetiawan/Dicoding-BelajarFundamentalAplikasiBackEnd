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
//? lebih baik membuat sebuah sekenario testing sebelum ngoding ( TDD), e.g flow dari apps
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