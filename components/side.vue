<template>
    <div class="flex flex-col rounded-lg relative" id="authorCard">
        <div class="flex flex-col justify-center py-4 mx-10 z-10">
            <Image :src="imageUrl" alt="Image" width="120" style="border-radius: 6px;"></Image>
            <div class="mt-1 text-center text-lg font-bold">面包etc</div>
        </div>
        <div class="px-5 flex flex-col justify-center">


        </div>
    </div>
</template>

<script lang="ts" setup>
import Image from 'primevue/image';

const imageUrl: string = "https://www.freeimg.cn/i/2024/05/19/664a1a0f4b164.jpg";
</script>

<style scoped></style>