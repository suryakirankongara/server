const jwt = require("jsonwebtoken");
const adminAuth = require("./adminAuth");
const doctorAuth = require("./doctorAuth");
const patientAuth = require("./patientAuth");
const Patient = require('../../models/patient');
const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");

async function userAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    req.sender = {
      id: payload.id,
      userType: payload.userType
    };

    if (payload.userType === "Admin") {
      // adminAuth(req, res, next);
    } else if (payload.userType === "Doctor") {
      // doctorAuth(req, res, next);
      const doctor = await Doctor.findOne({ userId: mongoose.Types.ObjectId(req.sender.id) });

      if (doctor) {
        req.sender.doctorId = doctor._id;
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else if (payload.userType === "Patient") {
      // patientAuth(req, res, next);
      const patient = await Patient.findOne({ userId: mongoose.Types.ObjectId(req.sender.id) });

      if (patient) {
        req.sender.patientId = patient._id;
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = userAuth;

