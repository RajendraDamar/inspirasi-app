import colors from './colors';

export const getAlertSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return {
        color: colors.critical,
        background: '#FFEBEE',
        icon: 'alert-octagon'
      };
    case 'warning':
      return {
        color: colors.warning,
        background: '#FFF3E0',
        icon: 'alert-triangle'
      };
    case 'advisory':
      return {
        color: colors.advisory,
        background: '#E3F2FD',
        icon: 'information'
      };
    default:
      return {
        color: colors.success,
        background: '#E8F5E8',
        icon: 'check-circle'
      };
  }
};

export default getAlertSeverityColor;
