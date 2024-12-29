export const TempExecDefine = reactive({
  id: '',
  symbol: '',
  contract: '',
  description: '',
  account: '',
  broker: '',
  td: '',
  sd: '',
  currency: '',
  type: '',
  side: '',
  strategy: '',
  quantity: 0,
  price: 0,
  exec_time: 0,
  commission: 0,
  grossProceeds: 0,
  netProceeds: 0,
  entry_time: 0,
  exit_time: 0,
  entry_price: 0,
  exit_price: 0
})

export const TempExecDefine2 = reactive({
  id: '',
  symbol: '',
  contract: '',
  description: '',
  account: '',
  broker: '',
  td: '',
  currency: '',
  type: '',
  side: '',
  strategy: '',
  quantity: 0,
  commission: 0,
  grossProceeds: 0,
  grossEntryProceeds: 0,
  netProceeds: 0,
  entry_time: 0,
  exit_time: 0,
  entry_price: 0,
  exit_price: 0
})

export function resetTempExecDefine() {
  TempExecDefine.id = ''
  TempExecDefine.symbol = ''
  TempExecDefine.contract = ''
  TempExecDefine.description = ''
  TempExecDefine.account = ''
  TempExecDefine.broker = ''
  TempExecDefine.td = ''
  TempExecDefine.sd = ''
  TempExecDefine.currency = ''
  TempExecDefine.type = ''
  TempExecDefine.side = ''
  TempExecDefine.strategy = ''
  TempExecDefine.quantity = 0
  TempExecDefine.price = 0
  TempExecDefine.exec_time = 0
  TempExecDefine.commission = 0
  TempExecDefine.grossProceeds = 0
  TempExecDefine.grossEntryProceeds = 0
  TempExecDefine.netProceeds = 0
  TempExecDefine.entry_time = 0
  TempExecDefine.exit_time = 0
  TempExecDefine.entry_price = 0
  TempExecDefine.exit_price = 0
}

export function resetTempExecDefine2() {
  TempExecDefine.id = ''
  TempExecDefine.symbol = ''
  TempExecDefine.contract = ''
  TempExecDefine.description = ''
  TempExecDefine.account = ''
  TempExecDefine.broker = ''
  TempExecDefine.td = ''
  TempExecDefine.currency = ''
  TempExecDefine.type = ''
  TempExecDefine.side = ''
  TempExecDefine.strategy = ''
  TempExecDefine.quantity = 0
  TempExecDefine.commission = 0
  TempExecDefine.grossProceeds = 0
  TempExecDefine.netProceeds = 0
  TempExecDefine.entry_time = 0
  TempExecDefine.exit_time = 0
  TempExecDefine.entry_price = 0
  TempExecDefine.exit_price = 0
}
