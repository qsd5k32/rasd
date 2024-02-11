<template>
  <div>
    <v-container class="mt-12">
      <v-row>
        <v-col cols="12" md="3">
          <form>
            <v-layout>
              <v-autocomplete :items="buildings" item-text="name" item-value="id" v-model="report.building_id" dense
                              label="مبنئ" outlined/>

              <v-autocomplete :items="disciplines" item-text="name" item-value="id" v-model="report.discipline_id" dense
                              label="مجال" outlined/>
            </v-layout>
            <v-layout>
              <v-autocomplete :items="work_shifts" item-text="name" item-value="id" v-model="report.work_shift_id" dense
                              label="المناوبة" outlined/>
              <div class="mx-1"></div>
              <v-autocomplete :items="visit_status" item-text="name" item-value="id" v-model="report.visit_status_id"
                              dense label="الوضع القائم" outlined/>
            </v-layout>
            <v-textarea v-model="report.description" rows="3" dense label="الشرح" outlined/>
            <v-btn color="primary" block dark class="mb-2" @click="storeReport">إضافة</v-btn>
          </form>
        </v-col>
        <v-col cols="12" md="9">
          <h3>التقارير اليومية</h3>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th>المبنئ</th>
                <th>المجال</th>
                <th>المناوبة</th>
                <th>الشرح</th>
                <th>الوضع القائم</th>
              </tr>
              </thead>
              <tbody v-for="dailyReport in reports">
              <tr v-if="dailyReport.visit_results" v-for="visitResult in dailyReport.visit_results">
                <td>
                  <span v-if="dailyReport.building">{{ dailyReport.building.name }}</span>
                </td>
                <td>
                  <span v-if="visitResult.discipline">
                      {{ visitResult.discipline.name }}
                    </span>
                </td>
                <td>
                  <span v-if="dailyReport.work_shift">
                      {{ dailyReport.work_shift.name }}
                    </span>
                </td>
                <td>{{ visitResult.description }}</td>
                <td>
                  <span v-if="visitResult.visit_status">
                      {{ visitResult.visit_status.name }}
                    </span>
                </td>
              </tr>

              </tbody>

            </template>
          </v-simple-table>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disciplines: [],
      visit_status: [],
      buildings: [],
      work_shifts: [],
      reports: [],
      report: {
        discipline_id: null,
        visit_status_id: null,
        work_shift_id: null,
        description: null
      }
    }
  },
  mounted() {
    this.getDisciplines();
    this.getVisitStatus();
    this.getWorkShifts();
    this.getBuildings();
    this.getReport();
  },
  methods: {
    storeReport() {
      this.$axios.post('/daily_report', this.report).then(response => {
        console.log(response);
        this.getReport();
        this.report = {
          discipline_id: null,
          visit_status_id: null,
          work_shift_id: null,
          description: null
        }
      });
    },
    getReport() {
      this.$axios.get('/daily_report').then(response => {
        this.reports = response.data.data;
      });
    },
    getDisciplines() {
      this.$axios.get('/discipline').then(response => {
        this.disciplines = response.data.data;
      });
    },
    getVisitStatus() {
      this.$axios.get('/visit_status').then(response => {
        this.visit_status = response.data.data;
      });
    },
    getWorkShifts() {
      this.$axios.get('/work_shift').then(response => {
        this.work_shifts = response.data.data;
      });
    },
    getBuildings() {
      this.$axios.get('/buildings').then(response => {
        this.buildings = response.data.data;
      });
    }
  }
}
</script>

<style>

</style>
