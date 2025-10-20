/**
 * Componente para generar reporte PDF con @react-pdf/renderer
 * Incluye: Métricas KPI y gráficas LDC (Por Hora y Por Día)
 */
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Tipos para las props
export interface ReportePDFProps {
  metricas: {
    energiaTotal: string;
    potenciaPico: string;
    potenciaMedia: string;
    factorCarga: string;
  };
  graficas: {
    ldc: string;        // Base64 data URL - Curva LDC
    porHora: string;    // Base64 data URL - Consumo Por Hora (Diario)
    porDia: string;     // Base64 data URL - Consumo Por Día (Semanal)
  };
  fechaGeneracion: string;
  periodoAnalisis?: string;
}

// Estilos para el PDF (tema Solarpunk)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },

  // Header
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #f59e0b',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },

  // Métricas section
  metricsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    borderLeft: '4 solid #f59e0b',
    paddingLeft: 10,
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  metricCard: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1 solid #e2e8f0',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  metricUnit: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },

  // Gráficas section
  chartSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  chartImage: {
    width: '100%',
    height: 'auto',
    maxHeight: 300,
    objectFit: 'contain',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#94a3b8',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },

  // Nueva página
  pageBreak: {
    marginTop: 40,
  },
});

export function ReportePDF({ metricas, graficas, fechaGeneracion, periodoAnalisis }: ReportePDFProps) {
  return (
    <Document>
      {/* Página 1: Portada y Métricas */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Análisis Energético</Text>
          <Text style={styles.subtitle}>Sistema de Monitoreo Fotovoltaico</Text>
          <Text style={styles.subtitle}>Generado: {fechaGeneracion}</Text>
          {periodoAnalisis && (
            <Text style={styles.subtitle}>Período: {periodoAnalisis}</Text>
          )}
        </View>

        {/* Sección de Métricas */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Métricas Principales</Text>

          <View style={styles.metricsGrid}>
            {/* Energía Total */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Energía Total</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{metricas.energiaTotal}</Text>
                <Text style={styles.metricUnit}>MWh</Text>
              </View>
            </View>

            {/* Potencia Pico */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Potencia Pico</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{metricas.potenciaPico}</Text>
                <Text style={styles.metricUnit}>kW</Text>
              </View>
            </View>

            {/* Potencia Media */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Potencia Media</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{metricas.potenciaMedia}</Text>
                <Text style={styles.metricUnit}>kW</Text>
              </View>
            </View>

            {/* Factor de Carga */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Factor de Carga</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.metricValue}>{metricas.factorCarga}</Text>
                <Text style={styles.metricUnit}>%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gráfica LDC */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Load Duration Curve (LDC)</Text>
          <Text style={styles.subtitle}>Potencias ordenadas de mayor a menor vs duración</Text>
          {graficas.ldc && (
            <Image src={graficas.ldc} style={styles.chartImage} />
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado con Sistema de Análisis Energético Solarpunk Dashboard - Página 1 de 3
        </Text>
      </Page>

      {/* Página 2: Consumo Por Hora (Diario) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Consumo Horario (Diario)</Text>
          <Text style={styles.subtitle}>Análisis de consumo por hora del día</Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Perfil de Consumo Horario</Text>
          {graficas.porHora && (
            <Image src={graficas.porHora} style={styles.chartImage} />
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado con Sistema de Análisis Energético Solarpunk Dashboard - Página 2 de 3
        </Text>
      </Page>

      {/* Página 3: Consumo Por Día (Semanal) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Consumo Diario (Semanal)</Text>
          <Text style={styles.subtitle}>Análisis de consumo por día de la semana</Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Perfil de Consumo Semanal</Text>
          {graficas.porDia && (
            <Image src={graficas.porDia} style={styles.chartImage} />
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado con Sistema de Análisis Energético Solarpunk Dashboard - Página 3 de 3
        </Text>
      </Page>
    </Document>
  );
}
