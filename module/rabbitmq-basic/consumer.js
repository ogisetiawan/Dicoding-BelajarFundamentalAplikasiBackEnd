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
  
   //? terima pesan pada antrian
  channel.consume(queue, (message) => {
    console.log(`Menerima pesan dari queue ${queue}: ${message.content.toString()}`);
  }, { noAck: true });
};
 
init();