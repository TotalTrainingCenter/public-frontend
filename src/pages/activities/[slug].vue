<script setup lang="ts">
import { siteConfig } from '@variables/site'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

const { activityGroups, findActivityGroup } = useLocalizedContent()

definePage({ meta: { layout: 'public' } })

const route = useRoute('activities-slug')

const group = computed(() => findActivityGroup(String(route.params.slug)))

const requiredItems = computed(() => group.value?.items.filter(item => item.required) ?? [])
const optionalItems = computed(() => group.value?.items.filter(item => !item.required) ?? [])

/** 내부 링크용 다른 그룹. 내부 링크는 색인에 크게 기여한다. */
const relatedGroups = computed(() =>
  activityGroups.value.filter(item => item.slug !== group.value?.slug).slice(0, 3))

useSeo({
  title: group.value?.title ?? t('page.activitiesTitle'),
  description: group.value?.description ?? t('page.activityFallbackDesc'),
  noindex: !group.value,
  jsonLd: group.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': group.value.title,
        'description': group.value.description,
        'inLanguage': 'ko-KR',
        'step': group.value.items.map((item, index) => ({
          '@type': 'HowToStep',
          'position': index + 1,
          'name': item.name,
          'text': t('page.activityProofJsonLd', { desc: item.description, proof: item.proof }),
        })),
      }
    : undefined,
})
</script>

<template>
  <template v-if="group">
    <PageHeader
      :eyebrow="group.category"
      :title="group.title"
      :lead="group.description"
    />

    <VContainer class="pb-16">
      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <p class="text-body-1 mb-8">
            {{ group.intro }}
          </p>

          <!-- 👉 기본 활동 -->
          <template v-if="requiredItems.length">
            <h2 class="text-h5 mb-2">
              {{ $t('page.activityRequired') }}
            </h2>

            <p class="text-body-2 mb-4">
              {{ $t('page.activityRequiredLead') }}
            </p>

            <VCard
              v-for="item in requiredItems"
              :key="item.name"
              variant="outlined"
              class="mb-3"
            >
              <VCardText>
                <div class="d-flex align-center gap-x-2 mb-2">
                  <h3 class="text-h6 mb-0">
                    {{ item.name }}
                  </h3>

                  <VChip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ $t('page.activityRequiredChip') }}
                  </VChip>
                </div>

                <p class="text-body-2 mb-2">
                  {{ item.description }}
                </p>

                <p class="text-body-2 text-disabled mb-0">
                  {{ $t('page.activityProof', { proof: item.proof, type: item.proofType }) }}
                </p>
              </VCardText>
            </VCard>
          </template>

          <!-- 👉 선택 활동 -->
          <template v-if="optionalItems.length">
            <h2 class="text-h5 mt-10 mb-2">
              {{ $t('page.activityOptional') }}
            </h2>

            <p class="text-body-2 mb-4">
              {{ $t('page.activityOptionalLead') }}
            </p>

            <VCard
              v-for="item in optionalItems"
              :key="item.name"
              variant="outlined"
              class="mb-3"
            >
              <VCardText>
                <h3 class="text-h6 mb-2">
                  {{ item.name }}
                </h3>

                <p class="text-body-2 mb-2">
                  {{ item.description }}
                </p>

                <p class="text-body-2 text-disabled mb-0">
                  {{ $t('page.activityProof', { proof: item.proof, type: item.proofType }) }}
                </p>
              </VCardText>
            </VCard>
          </template>
        </VCol>

        <!-- 👉 사이드 -->
        <VCol
          cols="12"
          md="4"
        >
          <VCard
            variant="tonal"
            color="primary"
            class="mb-6"
          >
            <VCardText>
              <h2 class="text-h6 mb-2">
                {{ $t('page.activityStartHere') }}
              </h2>

              <p class="text-body-2 mb-4">
                {{ $t('page.activitiesTargets', { list: group.targets.join(', ') }) }}
              </p>

              <VBtn
                :href="siteConfig.platformUrl"
                block
              >
                {{ $t('page.activityJoinPlatform') }}
              </VBtn>
            </VCardText>
          </VCard>

          <VCard variant="outlined">
            <VCardText>
              <h2 class="text-h6 mb-3">
                {{ $t('page.activityOther') }}
              </h2>

              <ul
                class="d-flex flex-column gap-y-2 ps-0"
                style="list-style: none;"
              >
                <li
                  v-for="related in relatedGroups"
                  :key="related.slug"
                >
                  <RouterLink :to="`/activities/${related.slug}`">
                    {{ related.title }}
                  </RouterLink>
                </li>
              </ul>

              <VDivider class="my-4" />

              <RouterLink to="/guide">
                {{ $t('page.activityHowToProve') }}
              </RouterLink>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </template>

  <VContainer
    v-else
    class="py-16 text-center"
  >
    <h1 class="text-h5 mb-4">
      {{ $t('page.activityMissing') }}
    </h1>

    <VBtn to="/activities">
      {{ $t('cta.allActivities') }}
    </VBtn>
  </VContainer>
</template>
