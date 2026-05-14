export interface Team {
  id: string;
  name: string;
  category: 'A' | 'B';
  fixed?: boolean;
}

export const CATEGORY_A_TEAMS: Team[] = [
  { id: 'A-01', name: '監控通報好幫手', category: 'A' },
  { id: 'A-02', name: 'AI 工具實戰：利用Copilot Studio打造你的專屬助理', category: 'A', fixed: true },
  { id: 'A-03', name: '客戶報修網頁與ＡＩ自動派工系統 (CHT Ticket)', category: 'A' },
  { id: 'A-04', name: '從告警到決策：以 AI 協作落地的 IPVPN 自有網骨幹監控平台', category: 'A' },
  { id: 'A-05', name: 'ARIA網路通報智慧自動歸檔系統 (Automated Report Intelligent Archiver)', category: 'A' },
];

export const CATEGORY_B_TEAMS: Team[] = [
  { id: 'B-01', name: '110/119 重要服務專線監控精進作業', category: 'B' },
  { id: 'B-02', name: '國際海纜障礙自動擬稿', category: 'B' },
];
