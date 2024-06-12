const signupUser = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      let response = {};
      if (!email) response.emailmsg = 'Email Empty';
      if (!password) response.pasdmsg = 'Password Empty';
      return res.status(400).json(response);
    }

    return res.status(201).json({ message: 'Signup successful', email });
  };
  
  module.exports = { signupUser };
  