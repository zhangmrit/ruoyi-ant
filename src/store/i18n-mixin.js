import { mapState } from 'vuex'
import { loadLanguageAsync } from '@/locales'
const i18nMixin = {
  computed: {
    ...mapState({
      currentLang: state => state.app.lang
    })
  },
  methods: {
    setLang (lang) {
      this.$store.dispatch('setLang', lang)
      loadLanguageAsync(lang)
    }
  }
}

export default i18nMixin
