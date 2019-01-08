console.log('?');

const t = async () => '123';
(async () => {
  const tt = await t();
  console.log(tt);
})()
