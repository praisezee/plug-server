module.exports = () =>
{
      const prefix = "INV";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomString;

      for ( let i = 0; i < 10; i++ ) {
            const randomIndex = Math.floor( Math.random() * characters.length );
            randomString += characters[ randomIndex ];
      }

      const timeStamp = Date.now().toString( 36 );
      return `${ prefix }${ timeStamp }${ randomString }`;
};

