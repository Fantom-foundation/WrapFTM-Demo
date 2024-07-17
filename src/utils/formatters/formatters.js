import { toInt } from '@/utils/big-number/big-number.js';
import { useFormatters } from 'fantom-vue3-components';

const { formatters } = useFormatters();

export function formatDateFromTimestamp(timestamp, dateType = 'shortDatetime') {
    return formatters.dateTime(new Date(toInt(timestamp) * 1000), dateType);
}
