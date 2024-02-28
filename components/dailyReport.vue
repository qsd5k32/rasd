<template>
  <div>
    <v-dialog v-model="createReportDialog">
      <v-card>
        <v-card-title>
          <h3>إضافة تقرير يومي</h3>
          <v-spacer/>
          <v-btn icon @click="createReportDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text cols="12" md="3">
          <form>
            <v-layout>
              <v-autocomplete :items="buildings" item-text="name" item-value="id" v-model="report.building_id" dense
                              label="مبنئ" outlined/>
              <div class="mx-1"></div>
              <v-autocomplete :items="work_shifts" item-text="name" item-value="id" v-model="report.work_shift_id" dense
                              label="المناوبة" outlined/>
            </v-layout>

            <v-text-field type="date" dense v-model="report.from" label="تاريخ" outlined/>
            <v-text-field type="time" dense v-model="report.from_time" label="من" outlined/>
            <v-text-field type="time" dense v-model="report.to_time" label="الي" outlined/>
            <v-btn color="primary" block dark class="mb-2" @click="storeReport">إضافة</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container class="mt-12">
      <v-row>
        <v-col cols="12" md="12">
          <h3 v-if="$auth.user.user_title">
             <span v-if="$auth.user.user_title.report_class.name == 'Cleaning'">
                قائمة التقارير اليومية  للنظافة
             </span>
              <span v-if="$auth.user.user_title.report_class.name == 'Maintenance'">
                  قائمة التقارير اليومية  للصيانة
              </span>
          </h3>

          <v-btn class="mt-4 mb-4" color="primary" @click="createReportDialog = true">إضافة تقرير يومي</v-btn>
          <v-layout wrap>
            <v-autocomplete :items="buildings" item-text="name" item-value="id" v-model="reportFilter.building_id" dense
                            label="مبنئ" outlined/>
            <div class="mx-1"></div>

            <v-autocomplete :items="work_shifts" item-text="name" item-value="id" v-model="reportFilter.work_shift_id" dense
                            label="المناوبة" outlined/>
            <div class="mx-1"></div>
            <v-text-field type="date" label="من" v-model="reportFilter.from" outlined dense></v-text-field>
            <div class="mx-1"></div>
            <v-text-field type="date" label="الي" v-model="reportFilter.to" outlined dense></v-text-field>
            <div class="mx-1"></div>
            <v-btn color="primary" @click="getReport">بحث</v-btn>
          </v-layout>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>#</th>
                <th>تاريخ</th>
                <th>المبنئ</th>
                <th>المناوبة</th>
                <th>من</th>
                <th>الي</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="dailyReport in reports" @click="openVisitResult(dailyReport)">
                <td>{{ dailyReport.id }}</td>
                <td>{{ dailyReport.from }}</td>
                <td>
                  <span v-if="dailyReport.building">{{ dailyReport.building.name }}</span>
                </td>
                <td>
                  <span v-if="dailyReport.work_shift">
                      {{ dailyReport.work_shift.name }}
                    </span>
                </td>
                <td>{{ dailyReport.from_time }}</td>
                <td>{{ dailyReport.to_time }}</td>

                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon small color="blue" v-bind="attrs" v-on="on" @click="openVisitResult(dailyReport)">
                        <v-icon>mdi-eye-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>عرض</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon small  v-bind="attrs" v-on="on" :color="dailyReport.is_done ? 'grey' : 'green'">
                        <v-icon v-if="dailyReport.is_done" >mdi-lock</v-icon>
                        <v-icon v-else>mdi-lock-open-variant</v-icon>
                      </v-btn>
                    </template>
                    <span v-if="dailyReport.is_done">
                      تم الارسال
                    </span>
                    <span v-else>
                      لم يتم الارسال
                    </span>
                  </v-tooltip>

                </td>
              </tr>

              </tbody>

            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-dialog persistent fullscreen v-model="visitResultDialog">

        <v-card v-if="dailyReportChoosed">
          <v-card-title>قائمة الفحوصات في التقرير اليومي</v-card-title>
          <div class="pt-12"></div>
          <v-layout class="d-print-none">
            <v-btn icon color="blue" @click="printPage">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-spacer/>
            <v-btn icon @click="closeVisitResult">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-layout>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12" style="font-weight: bold">
                <span><span>التاريخ:</span>
                  {{ dailyReportChoosed.from }}
                </span>
                /
                <span>
                  المبنئ:
                  <span v-if="dailyReportChoosed.building">{{ dailyReportChoosed.building.name }}</span>
                </span>
                /
                <span>
                  <span>المناوبة:</span>
                  <span v-if="dailyReportChoosed.work_shift">
                      {{ dailyReportChoosed.work_shift.name }}
                    </span>
                </span>
                /
                <span>
                  <span>من:</span>
                  {{ dailyReportChoosed.from_time }}
                </span>
                /
                <span>
                  <span>الي:</span>
                  {{ dailyReportChoosed.to_time }}
                </span>


                <v-divider class="mt-2 mb-2"></v-divider>
              </v-col>
              <v-col cols="12" md="12" class="d-print-none" v-if="!dailyReportChoosed.is_done">
                <v-form>
                  <v-layout>
                    <v-autocomplete :items="disciplines" item-text="name" @change="getSubDisciplines" item-value="id" v-model="report.discipline_id" dense
                                    label="المجلات" outlined/>
                    <div class="mx-1"></div>
                    <v-autocomplete :items="sub_disciplines" item-text="name" item-value="id" v-model="report.sub_discipline_id" dense
                                    label="المجلات الفرعية" outlined/>
                    <div class="mx-1"></div>


                    <v-autocomplete :items="visit_status" item-text="name.en" item-value="id" v-model="report.visit_status_id" dense
                                    label="الحالة" outlined/>
                  </v-layout>
                  <v-layout>
                    <v-autocomplete :items="spaces" item-text="name" item-value="id" @change="getRooms" v-model="report.space_id" dense
                                    label="المساحة" outlined/>
                    <div class="mx-1"></div>
                    <v-autocomplete :items="rooms" item-text="name" item-value="id" v-model="report.room_id" dense
                                    label="الغرفة" outlined/>
                  </v-layout>
                  <v-textarea dense rows="2" outlined label="الشرح" v-model="report.description"/>
                  <v-layout class="mb-3">
                    <v-spacer/>
                    <v-btn color="primary" @click="storeVisitResult">تخزين الفحص</v-btn>
                    <v-spacer/>
                  </v-layout>
                </v-form>
              </v-col>

            </v-row>

            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>المحال</th>
                  <th>المحال الفرعي</th>
                  <th>الحالة </th>
                  <th>المساجة</th>
                  <th>الغرفة</th>
                  <th>الشرح</th>
                  <th>التاريخ</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="visitResult in dailyReportChoosed.visit_results">
                    <td>
                      <span v-if="visitResult.discipline">{{ visitResult.discipline.name }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.sub_discipline">{{ visitResult.sub_discipline.name }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.visit_status">{{ visitResult.visit_status.name }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.space">{{ visitResult.space.name.en }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.room">{{ visitResult.room.name }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.description">{{ visitResult.description }}</span>
                    </td>
                    <td>
                      <span v-if="visitResult.created_at">{{ visitResult.created_at }}</span>
                    </td>
                    <td>
                      <v-btn v-if="!dailyReportChoosed.is_done" @click="openEditVisitResult(visitResult)" icon color="primary">
                        <v-icon>mdi-pencil-circle</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-layout class="d-print-none mt-5">
              <v-btn color="primary" v-if="!dailyReportChoosed.is_done" @click="openConfirmFinishDialog">اقفال</v-btn>
              <v-spacer/>
              <v-btn color="primary" @click="closeVisitResult">رجوع بدون اقفال</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-dialog v-model="editVisitResult">
          <v-card v-if="!confirmFinishDialog">
            <v-layout>
              <v-spacer/>
              <v-btn icon @click="editVisitResult = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-layout>
            <v-card-title>
              <h3>تعديل</h3>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12">
                  <v-form>
                    <v-layout>
                      <v-autocomplete :items="disciplines" item-text="name" item-value="id" v-model="visitResultForm.discipline_id" dense
                                      label="المجلات" outlined/>
                      <div class="mx-1"></div>
                      <v-autocomplete :items="sub_disciplines" item-text="name" item-value="id" v-model="visitResultForm.sub_discipline_id" dense
                                      label="المجلات الفرعية" outlined/>
                      <div class="mx-1"></div>
                      <v-autocomplete :items="visit_status" item-text="name" item-value="id" v-model="visitResultForm.visit_status_id" dense
                                      label="الحالة" outlined/>
                    </v-layout>
                    <v-layout>
                      <v-autocomplete :items="spaces" item-text="name[en]" item-value="id" @change="getRooms" v-model="visitResultForm.space_id" dense
                                      label="المساحة" outlined/>
                      <div class="mx-1"></div>
                      <v-autocomplete :items="rooms" item-text="name" item-value="id" v-model="visitResultForm.room_id" dense
                                      label="الغرفة" outlined/>
                    </v-layout>
                    <v-textarea dense rows="2" outlined label="الشرح" v-model="visitResultForm.description"/>
                    <v-btn block color="primary" @click="updateVisitResult">حفط</v-btn>
                  </v-form>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card v-if="confirmFinishDialog">
            <v-layout>
              <v-spacer/>
              <v-btn icon @click="closeConfirmFinishDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-layout>
            <v-card-title>هل انت متأكد تريد اقفال ؟</v-card-title>
            <v-card-text>
              <p>عند عمل اقفال لا يمكنك ان تعدل لاحقا</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" dark @click="finishReport(dailyReportChoosed)">نعم</v-btn>
              <v-btn color="primary" @click="confirmFinishDialog = false">لا</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visitResultDialog:false,
      editVisitResult:false,
      createReportDialog: false,
      disciplines: [],
      sub_disciplines: [],
      visit_status: [],
      buildings: [],
      work_shifts: [],
      reports: [],
      confirmFinishDialog: false,
      dailyReportChoosed: null,
      visitResultForm: {
        discipline_id: null,
        visit_status_id: null,
        description: null,
        visit_result_id: null,
        space_id: null,
        room_id: null,
        sub_discipline_id: null
      },
      reportFilter: {
        building_id: null,
        work_shift_id: null,
        from: null,
        to: null,

      },
      report: {
        daily_report_id: null,
        discipline_id: null,
        sub_discipline_id: null,
        visit_status_id: null,
        work_shift_id: null,
        from:null,
        to:null,
        description: null,
        from_time: null,
        to_time: null,
        building_id: null,
        space_id: null,
        room_id: null
      },
      spaces:[],
      rooms:[]
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
    getSpaces(building){
      this.$axios.get('spaces/'+building.id).then(response => {
        this.spaces = response.data.data;
      });
    },
    getRooms(){
      if (this.report.space_id == null) return
      this.$axios.get('rooms/'+this.report.space_id).then(response => {
        this.rooms = response.data.data;
      });
    },
    getSubDisciplines() {
      if (this.report.discipline_id == null) return
      let discipline = this.report.discipline_id
      this.$axios.get('/sub_discipline/' + discipline).then(response => {
        this.sub_disciplines = response.data.data;
      });
    },
    openConfirmFinishDialog(){
      this.confirmFinishDialog = true
      this.editVisitResult = true
    },
    closeConfirmFinishDialog(){
      this.confirmFinishDialog = false
      this.editVisitResult = false
    },
    storeReport() {
      this.report.to = this.report.from
      this.$axios.post('/daily_report', this.report).then(response => {
        console.log(response);
        this.getReport();
        this.report = {
          daily_report_id: null,
          discipline_id: null,
          visit_status_id: null,
          work_shift_id: null,
          from:null,
          to:null,
          description: null,
          from_time: null,
          to_time: null,
          building_id: null
        }
        this.createReportDialog = false
      });
    },
    printPage() {
      window.print();
    },
    storeVisitResult() {
      this.report.daily_report_id = this.dailyReportChoosed.id
      this.$axios.post('/visit_result', this.report).then(response => {
        console.log(response);
        this.dailyReportChoosed.visit_results.push(response.data.data)
        this.report = {
          discipline_id: null,
          visit_status_id: null,
          work_shift_id: null,
          description: null,
          daily_report_id: null
        }
      });
    },
    finishReport(report) {
      this.$axios.post('/daily-reports/finish/' + report.id).then(response => {
        console.log(response);
        //this.getReport();
        this.dailyReportChoosed.is_done = true
      });
    },
    updateVisitResult() {
      this.$axios.put('/visit_result/' + this.visitResultForm.visit_result_id, this.visitResultForm).then(response => {
        console.log(response);
        this.getReport();
        this.editVisitResult = false
        this.visitResultForm = {
          discipline_id: null,
          visit_status_id: null,
          description: null,
          visit_result_id: null
        }
      });
    },
    openEditVisitResult(visitResult){
      console.log(visitResult)
      this.editVisitResult = true
      this.visitResultForm = {
        discipline_id: visitResult.discipline_id,
        visit_status_id: visitResult.visit_status_id,
        description: visitResult.description,
        visit_result_id: visitResult.id,
        space_id: visitResult.space_id,
        room_id: visitResult.room_id,
        sub_discipline_id: visitResult.sub_discipline_id
      }

    },
    openVisitResult(report){
      this.dailyReportChoosed = report
      this.visitResultDialog = true
      this.getSpaces(this.dailyReportChoosed.building)
    },
    closeVisitResult(){
      this.visitResultDialog = false
      this.dailyReportChoosed = null
    },
    getReport() {
      this.$axios.get('/daily_report',{params : this.reportFilter}).then(response => {
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
