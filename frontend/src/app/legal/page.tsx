"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type LegalSection = "faq" | "returns" | "warranty" | "privacy" | "terms";

function LegalContent() {
  const searchParams = useSearchParams();
  const initialSection = (searchParams?.get("section") as LegalSection) || "faq";
  const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);

  useEffect(() => {
    const sec = searchParams?.get("section") as LegalSection;
    if (sec) setActiveSection(sec);
  }, [searchParams]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro Legal y Atención al Cliente</h1>
        <p className="text-xs text-slate-500 mt-1">
          Información oficial sobre términos de compra, garantías, devoluciones y protección de datos en NovaMarket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Navigation Menu */}
        <div className="md:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveSection("faq")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSection === "faq"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>❓ Preguntas Frecuentes (FAQ)</span>
          </button>

          <button
            onClick={() => setActiveSection("returns")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSection === "returns"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>🔄 Políticas de Devolución</span>
          </button>

          <button
            onClick={() => setActiveSection("warranty")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSection === "warranty"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>🛡️ Garantía Oficial</span>
          </button>

          <button
            onClick={() => setActiveSection("privacy")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSection === "privacy"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>🔒 Política de Privacidad</span>
          </button>

          <button
            onClick={() => setActiveSection("terms")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSection === "terms"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>📄 Términos de Uso</span>
          </button>
        </div>

        {/* Right Column: Detailed Document Body */}
        <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* SECTION 1: PREGUNTAS FRECUENTES */}
          {activeSection === "faq" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Preguntas Frecuentes (FAQ)
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm">¿Cuáles son los tiempos de envío?</h3>
                  <p>Los envíos exprés a domicilio se entregan en 24 a 48 horas hábiles dentro de las principales ciudades. Para el resto del país, el tiempo promedio es de 3 a 5 días hábiles.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm">¿Qué medios de pago aceptan?</h3>
                  <p>Aceptamos tarjetas de crédito y débito (Visa, Mastercard, AMEX), MercadoPago y transferencia bancaria directa con 10% de descuento adicional.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm">¿Cómo realizo el seguimiento de mi pedido?</h3>
                  <p>Una vez completada la compra, puedes ingresar a tu perfil de usuario en la sección &quot;Mis Pedidos y Tracking&quot; para consultar el estado en tiempo real.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm">¿Los productos son nuevos y originales?</h3>
                  <p>Sí, en NovaMarket comercializamos únicamente productos 100% nuevos, sellados de fábrica y con garantía oficial del fabricante.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: POLÍTICAS DE DEVOLUCIÓN */}
          {activeSection === "returns" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Políticas de Devolución y Cambio Directo
              </h2>

              <div className="space-y-3">
                <p>En NovaMarket nos comprometemos a garantizar tu satisfacción total. Si el producto adquirido presenta alguna falla o no cumple con tus expectativas, dispones de <strong>30 días corridos</strong> desde la recepción para solicitar la devolución o el cambio directo.</p>
                
                <h3 className="font-bold text-slate-900 text-xs pt-2">Condiciones para la devolución:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>El producto debe encontrarse en su empaque original sin daños físicos.</li>
                  <li>Debe conservar todos sus accesorios, manuales, cables y certificados de garantía.</li>
                  <li>Presentar la factura de compra o el número de orden generado en el sitio web.</li>
                </ul>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Proceso de reembolso:</h3>
                <p>Una vez recibido e inspeccionado el producto devuelto en nuestro depósito central, el reembolso se procesará al mismo medio de pago utilizado en un plazo de 48 a 72 horas hábiles.</p>
              </div>
            </div>
          )}

          {/* SECTION 3: GARANTÍA OFICIAL */}
          {activeSection === "warranty" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Garantía Oficial de Fábrica
              </h2>

              <div className="space-y-3">
                <p>Todos los productos tecnológicos comercializados en NovaMarket cuentan con una <strong>Garantía Oficial de 12 meses</strong> respaldada directamente por el fabricante y nuestra tienda.</p>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Cobertura de la garantía:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Defectos de fabricación en hardware, pantallas, procesadores y componentes internos.</li>
                  <li>Fallas de funcionamiento no derivadas de un mal uso o golpe físico.</li>
                  <li>Reparación o reemplazo del producto por una unidad totalmente nueva en caso de falla irreparable.</li>
                </ul>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Exclusiones:</h3>
                <p>La garantía no cubre daños ocasionados por derrames de líquidos, caídas accidentales, alteraciones de software no autorizadas o picos de tensión eléctrica.</p>
              </div>
            </div>
          )}

          {/* SECTION 4: POLÍTICA DE PRIVACIDAD */}
          {activeSection === "privacy" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Política de Privacidad y Protección de Datos
              </h2>

              <div className="space-y-3">
                <p>En NovaMarket la privacidad de nuestros usuarios es una prioridad fundamental. Los datos personales recolectados durante la navegación y el proceso de compra son tratados con estricta confidencialidad de acuerdo con las leyes de protección de datos personales vigentes.</p>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Datos recolectados y uso:</h3>
                <p>Utilizamos tu nombre, correo electrónico, dirección y teléfono exclusivamente para procesar tus compras, gestionar los envíos y enviarte notificaciones sobre el estado de tu pedido.</p>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Seguridad Encriptada SSL:</h3>
                <p>Toda la información sensible transmitida durante las transacciones utiliza encriptación de 256 bits mediante protocolo de seguridad SSL. No almacenamos datos completos de tarjetas de crédito en nuestros servidores.</p>
              </div>
            </div>
          )}

          {/* SECTION 5: TÉRMINOS DE USO */}
          {activeSection === "terms" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Términos y Condiciones de Uso
              </h2>

              <div className="space-y-3">
                <p>Bienvenido a NovaMarket. Al navegar y realizar compras en nuestro portal e-commerce, aceptas regirte por los siguientes términos y condiciones de servicio.</p>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Precios y Stock:</h3>
                <p>Todos los precios indicados en el sitio están expresados en la moneda oficial y pueden modificarse sin previo aviso. Las promociones y cupones de descuento están sujetos a la disponibilidad de stock.</p>

                <h3 className="font-bold text-slate-900 text-xs pt-2">Aceptación del Pedido:</h3>
                <p>El envío de la confirmación de la orden vía correo electrónico implica la aceptación del contrato de compraventa y el compromiso de despacho del paquete en las condiciones acordadas.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500 text-sm">Cargando documento...</div>}>
      <LegalContent />
    </Suspense>
  );
}
