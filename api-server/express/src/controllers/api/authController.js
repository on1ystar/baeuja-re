import jwt from 'jsonwebtoken';
import dbClient from '../../dbConnect';
import conf from '../../config';

export const loginAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const query = {
      name: 'selectAdminByEmail',
      text: 'SELECT * FROM admin WHERE email = $1',
      values: [email]
    };
    const admin = (await dbClient.query(query)).rows[0];
    if (!admin) {
      console.log('InvalidEmailError: ', 'Admin does not exist');
      return res
        .status(400)
        .json({ success: false, errorMessage: 'Email Verification Failed' });
    }
    const token = await jwt.sign(
      { id: admin.id, email: admin.email },
      conf.jwt.secretKey,
      conf.jwt.options
    );
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.log('selectAdminByEmailError: ', err.stack);
    return res.status(502).end();
  }
};

export const other = () => {
  //
};
