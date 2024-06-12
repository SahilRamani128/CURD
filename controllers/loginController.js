const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      let response = {};
      if (!email) response.emailmsg = 'Email Empty';
      if (!password) response.pasdmsg = 'Password Empty';
      return res.status(400).json(response);
    }

    if (email === 'test@example.com' && password === 'password123') {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  };
  
  module.exports = { loginUser };
  