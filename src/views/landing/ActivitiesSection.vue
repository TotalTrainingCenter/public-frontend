<script setup lang="ts">
const { activityGroups, totalActivityCount } = useLocalizedContent()

const featured = computed(() => activityGroups.value.slice(0, 3))
</script>

<template>
  <section
    id="activities"
    class="activities-section"
  >
    <VContainer>
      <div class="text-center mb-12">
        <VChip
          variant="tonal"
          color="primary"
          class="mb-4"
        >
          Activities
        </VChip>

        <h2 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              {{ $t('landing.activitiesHeadingA') }}
            </div>
          </div>
          {{ $t('landing.activitiesHeadingB') }}
        </h2>

        <p class="text-body-1">
          {{ $t('landing.activitiesLead1') }}
          {{ $t('landing.activitiesLead2', { groups: activityGroups.length, activities: totalActivityCount }) }}
        </p>
      </div>

      <VRow>
        <VCol
          v-for="activity in featured"
          :key="activity.slug"
          cols="12"
          md="4"
        >
          <VCard
            :to="`/activities/${activity.slug}`"
            class="h-100"
          >
            <VCardText>
              <VChip
                size="small"
                variant="tonal"
                class="mb-3"
              >
                {{ $t('landing.activitiesCount', { n: activity.items.length }) }}
              </VChip>

              <h3 class="text-h6 mb-2">
                {{ activity.title }}
              </h3>

              <p class="text-body-2 mb-0">
                {{ activity.description }}
              </p>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <div class="text-center mt-8">
        <VBtn
          to="/activities"
          variant="tonal"
        >
          {{ $t('cta.allActivities') }}
        </VBtn>
      </div>
    </VContainer>
  </section>
</template>

<style lang="scss" scoped>
.activities-section {
  padding-block: 5rem;
}

/* Vuexy 랜딩의 섹션 제목 강조(밑줄 브러시)를 동일하게 쓴다 */
.section-title::after {
  position: absolute;
  background: url("../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}
</style>
