<template>
    <div>
        <FooterMobile v-if="isMobile" />
        <Footer v-else />
    </div>
</template>

<script>
import Footer from "./Footer";
import FooterMobile from "./FooterMobile";
import { mixinDetectingMobile } from "@/components/layout/MobileMixin";
export default {
    mixins: [mixinDetectingMobile],
    components: {
        Footer,
        FooterMobile
    }
}
</script>

<style>

</style>