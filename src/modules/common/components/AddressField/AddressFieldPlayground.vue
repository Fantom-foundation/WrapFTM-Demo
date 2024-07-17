<script setup>
import AddressField from './AddressField.vue';
import { FForm } from 'fantom-vue3-components';

function addressResolver(value, valueIsAddress = false) {
    const ADDRESS = '0xeb57521b52E1102eE6B1422BA3A6F53D0C9E18cb';
    const NAME = 'valid_name';
    const result = {
        address: '',
        name: '',
    };

    if (valueIsAddress) {
        if (value === ADDRESS) {
            result.address = ADDRESS;
            result.name = NAME;
        }
    } else {
        if (value === NAME) {
            result.address = ADDRESS;
            result.name = NAME;
        }
    }

    return result;
}
</script>

<template>
    <div class="playground_content">
        <FForm>
            <AddressField
                field-size="large"
                placeholder="Input opera adress"
                clas="input-w100"
                :address-resolver="addressResolver"
                label="Input 'valid_name' or ethereum compatible address"
            />
        </FForm>
    </div>
</template>
