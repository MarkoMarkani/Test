const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')
//Oracle db conection
const oracledb = require('oracledb')

const connectMongo = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

const connectOracle = async () => {
  try {
    await oracledb.getConnection(
      {
        user: 'SYSTEM',
        password: 'VanBasten9',
        connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=orcl)))',
      }
	);
	console.log('Oracle connected');
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectOracle;
