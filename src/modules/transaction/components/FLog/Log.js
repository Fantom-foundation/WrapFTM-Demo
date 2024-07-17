import { ref } from 'vue';

export class Log {
    static #rows = ref([]);

    static get rows() {
        return Log.#rows.value.join('\n');
    }

    static isEmpty() {
        return Log.#rows.value.length === 0;
    }

    static push(text) {
        Log.#rows.value.push(text);
    }

    static clear(rows = []) {
        Log.#rows.value = rows;
    }
}
