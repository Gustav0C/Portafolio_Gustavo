"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSending(true);

    // Simulate form submission (replace with real service like Formspree)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    setSubmitted(true);
    setSending(false);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (submitted) {
    return (
      <div className={styles.contacto}>
        <h1 className={styles.title}>Contacto</h1>
        <div className={styles.success}>
          <p>¡Mensaje enviado!</p>
          <p className={styles.successText}>
            Gracias por contactarme. Te responderé pronto.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className={styles.btn}
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contacto}>
      <h1 className={styles.title}>Contacto</h1>
      <p className={styles.subtitle}>
        ¿Tienes preguntas o quieres trabajar juntos? Escríbeme.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={styles.input}
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            placeholder="Tu mensaje..."
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <p className={styles.error}>{errors.message}</p>}
        </div>

        <button type="submit" className={styles.btn} disabled={sending}>
          {sending ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
}