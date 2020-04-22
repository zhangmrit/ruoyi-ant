import { DatePicker } from 'ant-design-vue'

const YearPicker = {
  name: 'YearPicker',
  data () {
    return {
      state: {
        isopen: false,
        time: null
      }
    }
  },
  methods: {
    handlePanelChange (value) {
      this.$emit('change', value)
      this.setState({
        time: value,
        isopen: false
      })
    },
    handleOpenChange  (status) {
      if (status) {
        this.setState({ isopen: true })
      } else {
        this.setState({ isopen: false })
      }
    },
    setState  (obj) {
      this.state.isopen = obj.isopen
      this.state.time = obj.time || null
    },
    clearValue () {
      this.$emit('change', null)
      this.setState({
        time: null
      })
    }
  },

  render () {
    const { isopen, time } = this.state
    return (
      <div>
        <DatePicker
          value={time}
          open={isopen}
          mode="year"
          placeholder='请选择年份'
          format="YYYY"
          onOpenChange={this.handleOpenChange}
          onPanelChange={this.handlePanelChange}
          onChange={this.clearValue}
        />
      </div>
    )
  }
}
export default YearPicker
