<!--
  비회원 문의 폼(서버 `/v1/inquiry-guest`). 로그인 없이 남기고 답변은 메일로 받는다.
  - 개인정보 수집·이용 동의가 필수다(이름·메일 주소를 받는다).
  - website 칸은 사람에게 보이지 않는다. 자동 입력 프로그램이 채우면 서버가 저장하지 않는다.
  - 서버 운영 설정에서 비회원 문의를 끄면 거절 안내가 뜬다.
  프리렌더 HTML 에는 빈 폼만 들어간다(검색엔진에 노출될 내용은 없다).
-->
<script setup lang="ts">
import { $api } from '@/utils/api'

const props = withDefaults(defineProps<{
  category?: string
}>(), {
  category: 'OTHER',
})

const { t } = useI18n()

const CATEGORIES = ['USAGE', 'PAYMENT', 'ACCOUNT', 'REPORT', 'PARTNERSHIP', 'OTHER'] as const

const form = reactive({
  name: '',
  email: '',
  category: props.category,
  subject: '',
  content: '',
  agree: false,
  website: '',
})

const sending = ref(false)
const sent = ref(false)

const categoryItems = computed(() => CATEGORIES.map(value => ({ value, title: t(`guestInquiry.category.${value}`) })))

const EMAIL = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i

const valid = computed(() => form.name.trim() && EMAIL.test(form.email.trim()) && form.subject.trim() && form.content.trim() && form.agree)

const submit = async () => {
  if (!valid.value || sending.value)
    return

  sending.value = true
  try {
    await $api('/v1/inquiry-guest', {
      method: 'POST',
      body: { ...form, name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), content: form.content.trim() },
    })
    sent.value = true
  }
  catch {
    // 오류 안내는 $api 가 띄운다.
  }
  finally {
    sending.value = false
  }
}

const again = () => {
  form.subject = ''
  form.content = ''
  sent.value = false
}
</script>

<template>
  <VCard variant="outlined">
    <VCardText
      v-if="sent"
      class="text-center py-10"
    >
      <VIcon
        icon="tabler-circle-check"
        color="success"
        size="44"
        class="mb-3"
      />
      <h2 class="text-h6 mb-2">
        {{ $t('guestInquiry.sentTitle') }}
      </h2>
      <p class="text-body-2 mb-5">
        {{ $t('guestInquiry.sentBody', { email: form.email }) }}
      </p>
      <VBtn
        variant="tonal"
        @click="again"
      >
        {{ $t('guestInquiry.again') }}
      </VBtn>
    </VCardText>

    <VCardText
      v-else
      class="d-flex flex-column ga-4 pa-6"
    >
      <div>
        <h2 class="text-h6 mb-1">
          {{ $t('guestInquiry.title') }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ $t('guestInquiry.lead') }}
        </p>
      </div>

      <VRow dense>
        <VCol
          cols="12"
          sm="6"
        >
          <AppTextField
            v-model="form.name"
            :label="$t('guestInquiry.name')"
            :maxlength="50"
            autocomplete="name"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <AppTextField
            v-model="form.email"
            type="email"
            :label="$t('guestInquiry.email')"
            :maxlength="200"
            autocomplete="email"
          />
        </VCol>
      </VRow>
      <AppSelect
        v-model="form.category"
        :items="categoryItems"
        :label="$t('guestInquiry.categoryLabel')"
      />
      <AppTextField
        v-model="form.subject"
        :label="$t('guestInquiry.subject')"
        :counter="100"
        :maxlength="100"
      />
      <AppTextarea
        v-model="form.content"
        :label="$t('guestInquiry.content')"
        rows="6"
        auto-grow
        :counter="3000"
        :maxlength="3000"
      />

      <!-- 사람에게는 보이지 않는 칸(자동 입력 거르기). 화면 낭독기·키보드 이동에서도 뺀다. -->
      <div
        class="guest-inquiry-trap"
        aria-hidden="true"
      >
        <label>
          website
          <input
            v-model="form.website"
            type="text"
            tabindex="-1"
            autocomplete="off"
          >
        </label>
      </div>

      <VSheet
        rounded
        class="pa-4 guest-inquiry-consent text-body-2"
      >
        <div class="font-weight-medium mb-1">
          {{ $t('guestInquiry.consentTitle') }}
        </div>
        <ul class="ps-4 mb-0">
          <li>{{ $t('guestInquiry.consentItems') }}</li>
          <li>{{ $t('guestInquiry.consentPurpose') }}</li>
          <li>{{ $t('guestInquiry.consentPeriod') }}</li>
          <li>{{ $t('guestInquiry.consentRefuse') }}</li>
        </ul>
      </VSheet>
      <VCheckbox
        v-model="form.agree"
        :label="$t('guestInquiry.agree')"
        hide-details
        density="compact"
      />

      <div class="d-flex justify-end">
        <VBtn
          size="large"
          prepend-icon="tabler-send"
          :disabled="!valid"
          :loading="sending"
          @click="submit"
        >
          {{ $t('guestInquiry.submit') }}
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.guest-inquiry-trap {
  position: absolute;
  overflow: hidden;
  block-size: 1px;
  inline-size: 1px;
  inset-inline-start: -10000px;
}

.guest-inquiry-consent {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
