import { useEffect } from 'react';

export const SchemaFAQ = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هي أسعار تأجير السيارات في دبي؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تختلف أسعار تأجير السيارات في دبي حسب نوع السيارة ومدة الإيجار. نقدم أسعار تنافسية تبدأ من أسعار اقتصادية للسيارات العادية وحتى أسعار مميزة للسيارات الفاخرة مع خيارات الإيجار اليومي والأسبوعي والشهري."
          }
        },
        {
          "@type": "Question",
          "name": "هل تقدمون خدمة التوصيل للمطار؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، نقدم خدمة التوصيل المجاني لمطار دبي الدولي ومطار آل مكتوم الدولي. فريقنا متاح على مدار الساعة لتوصيل السيارة في الوقت المحدد."
          }
        },
        {
          "@type": "Question",
          "name": "ما هي المستندات المطلوبة لتأجير سيارة في دبي؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تحتاج إلى رخصة قيادة سارية المفعول، جواز سفر أو هوية إماراتية، وبطاقة ائتمان للضمان. نقبل الرخص الدولية والرخص من دول مجلس التعاون الخليجي."
          }
        },
        {
          "@type": "Question",
          "name": "هل السيارات مؤمنة؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، جميع سياراتنا مؤمنة تأميناً شاملاً يغطي الحوادث والأضرار. نوفر أيضاً خيارات تأمين إضافية لمزيد من الحماية والراحة."
          }
        },
        {
          "@type": "Question",
          "name": "كم ساعة خدمة العملاء متاحة؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "خدمة العملاء متاحة على مدار الساعة طوال أيام الأسبوع (24/7). يمكنك التواصل معنا عبر الهاتف أو واتساب في أي وقت للحصول على المساعدة أو الاستفسارات."
          }
        },
        {
          "@type": "Question",
          "name": "هل يمكن إلغاء الحجز؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، يمكن إلغاء الحجز وفقاً لسياسة الإلغاء الخاصة بنا. نوفر مرونة في الإلغاء والتعديل على الحجوزات حسب الظروف والمدة المتبقية على موعد الاستلام."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-faq';
    
    // Remove existing schema if present
    const existing = document.getElementById('schema-faq');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById('schema-faq');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  return null;
};