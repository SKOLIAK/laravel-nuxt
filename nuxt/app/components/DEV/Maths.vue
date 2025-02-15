
<script lang="ts" setup>
import { sum } from 'lodash'
const nums = ref([13, 12, 5, 7, 26, 15, 6, 5, 32, 19, 32, 12, 14, 5, 34, 27, 45, 38, 32, 8, 32, 55, 67])


const maths_missing_value_expected = ref(randomBetween(getLowest(nums.value), getHighest(nums.value)))

/*
*  Even:    m = ((n / 2) + ((n / 2) + 1)) / 2
*  Odd:     m = (n + 1) / 2
*  Based on these formulas we can calculate the position of the median value.
*  We subtract 1 to know the key value of the array
*/
const Maths = computed(() => {
    let temp    = {}
    temp.mean   = useTwoDecFormat(getMean(nums.value))
    temp.median = useTwoDecFormat(getMedian(nums.value))
    temp.mode   = getMode(nums.value)
    temp.range  = useTwoDecFormat(getRange(nums.value))

    temp.mid_range = (getHighest(nums.value) + getLowest(nums.value)) / 2

    /**
     * Coefficient of Range
     * High values show how data is spread-out */
    temp.cr = useTwoDecFormat(temp.range / (getHighest(nums.value) + getLowest(nums.value)))

    /** (Net Income / Total Assets) * 100 */
    temp.roa = useTwoDecPercentFormat(250 / 50000)

    temp.missing_value = (maths_missing_value_expected.value * (nums.value.length + 1)) - sum(nums.value)


    return temp
})

</script>
<template>
            <div class="p-10 text-sm font-medium drop-shadow bg-primary/20 text-white flex flex-col gap-4">

<div class="">
    <h3>DATASET: ( {{ nums.length }} )</h3>
    <small>{{ nums.sort((a, b) => a - b) }}</small>
</div>

<div class="">
    <h3>Sorting by Mode: (Descending Order)</h3>
    <small>{{ useSortByMode(nums, 'desc') }}</small>
</div>

<div class="">
    <h3>Sorting by Mode: (Ascending Order)</h3>
    <small>{{ useSortByMode(nums, 'asc') }}</small>
</div>

<div>
    <h3>Mean/Avg: {{ Maths.mean }}</h3>
    <p class="text-xs opacity-70">sum(x) / n</p>
</div>

<div>
    <h3>Median: {{ Maths.median }}</h3>
    <p class="text-xs opacity-70">
        Odd: (n + 1) / 2
        <span class="text-black opacity-60 mx-2">|</span>
        Even: ( (n / 2) + ((n / 2) + 1) ) / 2
    </p>
</div>

<div>
    <h3>Mode: {{ Maths.mode }}</h3>
    <p class="text-xs opacity-70">Number of a dataset with most occurences</p>
</div>

<div>
    <h3>Range: {{ Maths.range }}</h3>
    <p class="text-xs opacity-70">Highest - Lowest</p>
</div>

<div>
    <h3>Middle Range: {{ Maths.mid_range }}</h3>
    <p class="text-xs opacity-70">(Highest + Lowest) / 2</p>

    </div>

<div>
    <h3>Coefficient of Range: {{ Maths.cr }}</h3>
    <p class="text-xs opacity-70">Range / (Highest + Lowest)</p>
</div>

<div>
    <h3>25th Percentile: {{ getPercentile(nums,25) }}</h3>
    <p class="text-xs opacity-70"></p>
</div>

<div>
    <h3>50th Percentile: {{ getPercentile(nums,50) }}</h3>
    <p class="text-xs opacity-70"></p>
</div>

<div>
    <h3>75th Percentile: {{ getPercentile(nums,75) }}</h3>
    <p class="text-xs opacity-70"></p>
</div>

<div>
    <h3>Missing Value: {{ Maths.missing_value }}</h3>
    <input class="p-1.5 rounded" type="number" v-model="maths_missing_value_expected"/>
    <p class="text-xs opacity-70">To achieve Mean value of given input ^, what the next data entry should be</p>
</div>

<UDivider />


<div>
    <h3>Return On Assets (ROA): {{ Maths.roa }}</h3>
    <p class="text-xs opacity-70">(Net Income (250$) / Total Assets (50,000$)) * 100</p>
</div>

<UDivider />
</div>

</template>
