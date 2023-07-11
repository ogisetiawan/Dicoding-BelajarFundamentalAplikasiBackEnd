//@ PROGRAM MENGIRIM PESAN KE QUEUE
const amqp = require('amqplib'); //? protokol AMQP 

const init = async () => {
  const connection = await amqp.connect('amqp://localhost'); //? route connection
  const channel = await connection.createChannel(); //? objek channel untuk call API

  const queue = 'dicoding'; //? queu/subject
  const message = 'Selamat belajar message broker!'; //? content

  //? checking
  await channel.assertQueue(queue, {
    durable: true, //? option
  });

  //? kirim pesan ke antrian
  await channel.sendToQueue(queue, Buffer.from(message));//? param queue pesan dan dlm bentuk buffer
  console.log('Pesan berhasil terkirim!');

  //? jeda setiap 1 detik, untuk close connection
  setTimeout(() => {
    connection.close();
  }, 1000);
};
 
init();