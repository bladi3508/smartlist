import passport from "passport";
import { User } from "../models/Usuario.js";

// Serialización (obligatoria para sesiones)
passport.serializeUser((user, done) => {
  done(null, user.id); // Guarda solo el ID en la sesión
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'nombre', 'email']
    });
    
    done(null, user); // Carga el usuario completo desde la DB
  } catch (error) {
    done(error);
  }
});