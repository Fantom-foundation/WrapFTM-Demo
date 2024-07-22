import { ref } from 'vue';

export class Log {
    static #rows = ref([]);

    static get rows() {
        return this.#rows.value.join('\n');
    }

    static isEmpty() {
        return this.#rows.value.length === 0;
    }

    static push(text) {
        this.#rows.value.push(text);
    }

    static clear(rows = []) {
        this.#rows.value = rows;
    }
}
