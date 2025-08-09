// Spreadsheet ID - Updated with your spreadsheet
const SPREADSHEET_ID = '13UeO4xic6nZUUVyhcEIJyUJtZrK3C0BI83YB9nmYf5A';

function doGet(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.TEXT);
  
  // Get the sheet parameter
  const sheetName = e.parameter.sheet || 'INFO_SEKOLAH';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return output.setContent('Sheet not found: ' + sheetName);
    }
    
    // Get all data from the sheet
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Convert to CSV format
    let csvContent = '';
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const csvRow = row.map(cell => {
        // Handle cells that might contain commas or quotes
        let cellValue = String(cell || '');
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          cellValue = '"' + cellValue.replace(/"/g, '""') + '"';
        }
        return cellValue;
      }).join(',');
      csvContent += csvRow + '\n';
    }
    
    return output.setContent(csvContent);
    
  } catch (error) {
    return output.setContent('Error: ' + error.toString());
  }
}

// Function to get school info from INFO_SEKOLAH sheet
function getSchoolInfo() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('INFO_SEKOLAH');
    
    if (!sheet) {
      throw new Error('Sheet INFO_SEKOLAH not found');
    }
    
    // Get data from row 2 (assuming row 1 has headers)
    // Columns: A=NAMA_SEKOLAH, B=ALAMAT_SEKOLAH, C=TELEPON_SEKOLAH, D=LOGO_SEKOLAH
    const namaSekolah = sheet.getRange('A2').getValue() || '';
    const alamatSekolah = sheet.getRange('B2').getValue() || '';
    const teleponSekolah = sheet.getRange('C2').getValue() || '';
    const logoSekolah = sheet.getRange('D2').getValue() || '';
    
    console.log('School Info:');
    console.log('Nama Sekolah:', namaSekolah);
    console.log('Alamat Sekolah:', alamatSekolah);
    console.log('Telepon Sekolah:', teleponSekolah);
    console.log('Logo Sekolah:', logoSekolah);
    
    return {
      namaSekolah: namaSekolah,
      alamatSekolah: alamatSekolah,
      teleponSekolah: teleponSekolah,
      logoSekolah: logoSekolah
    };
    
  } catch (error) {
    console.error('Error getting school info:', error);
    return null;
  }
}

// Function to get student data from DATA_SISWA sheet
function getStudentData(username, password) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('DATA_SISWA');
    
    if (!sheet) {
      throw new Error('Sheet DATA_SISWA not found');
    }
    
    // Get all data
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Skip header row and find matching student
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Column structure based on your spreadsheet:
      // A=ID_SISWA, B=NISN, C=USERNAME_SISWA, D=PASSWORD_SISWA, E=NAMA_LENGKAP_SISWA, 
      // F=KELAS_SISWA, G=WALI_KELAS, H=TEMPAT_LAHIR, I=TANGGAL_LAHIR, J=JENIS_KELAMIN, 
      // K=FOTO_SISWA, L=TAHUN_AJARAN, M=AGAMA_SISWA
      
      const studentUsername = String(row[2] || '').trim(); // Column C (USERNAME_SISWA)
      const studentPassword = String(row[3] || '').trim(); // Column D (PASSWORD_SISWA)
      
      if (studentUsername === username && studentPassword === password) {
        return {
          idSiswa: row[0] || '',           // Column A (ID_SISWA)
          nisn: row[1] || '',              // Column B (NISN)
          usernameSiswa: row[2] || '',     // Column C (USERNAME_SISWA)
          passwordSiswa: row[3] || '',     // Column D (PASSWORD_SISWA)
          namaLengkapSiswa: row[4] || '',  // Column E (NAMA_LENGKAP_SISWA)
          kelasSiswa: row[5] || '',        // Column F (KELAS_SISWA)
          waliKelas: row[6] || '',         // Column G (WALI_KELAS)
          tempatLahir: row[7] || '',       // Column H (TEMPAT_LAHIR)
          tanggalLahir: row[8] || '',      // Column I (TANGGAL_LAHIR)
          jenisKelamin: row[9] || '',      // Column J (JENIS_KELAMIN)
          fotoSiswa: row[10] || '',        // Column K (FOTO_SISWA)
          tahunAjaran: row[11] || '',      // Column L (TAHUN_AJARAN)
          agamaSiswa: row[12] || ''        // Column M (AGAMA_SISWA)
        };
      }
    }
    
    return null; // Student not found
    
  } catch (error) {
    console.error('Error getting student data:', error);
    return null;
  }
}

// Function to get teacher data from DATA_GURU sheet
function getTeacherData(username, password) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('DATA_GURU');
    
    if (!sheet) {
      throw new Error('Sheet DATA_GURU not found');
    }
    
    // Get all data
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Skip header row and find matching teacher
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Column structure based on your spreadsheet:
      // A=ID_GURU, B=NIP_GURU, C=USERNAME_GURU, D=PASSWORD_GURU, E=NAMA_LENGKAP_GURU,
      // F=MATA_PELAJARAN, G=KELAS_YANG_DIAJAR, H=NO_HP_GURU, I=EMAIL_GURU, 
      // J=ALAMAT_GURU, K=FOTO_GURU
      
      const teacherUsername = String(row[2] || '').trim(); // Column C (USERNAME_GURU)
      const teacherPassword = String(row[3] || '').trim(); // Column D (PASSWORD_GURU)
      
      if (teacherUsername === username && teacherPassword === password) {
        return {
          idGuru: row[0] || '',            // Column A (ID_GURU)
          nipGuru: row[1] || '',           // Column B (NIP_GURU)
          usernameGuru: row[2] || '',      // Column C (USERNAME_GURU)
          passwordGuru: row[3] || '',      // Column D (PASSWORD_GURU)
          namaLengkapGuru: row[4] || '',   // Column E (NAMA_LENGKAP_GURU)
          mataPelajaran: row[5] || '',     // Column F (MATA_PELAJARAN)
          kelasYangDiajar: row[6] || '',   // Column G (KELAS_YANG_DIAJAR)
          noHpGuru: row[7] || '',          // Column H (NO_HP_GURU)
          emailGuru: row[8] || '',         // Column I (EMAIL_GURU)
          alamatGuru: row[9] || '',        // Column J (ALAMAT_GURU)
          fotoGuru: row[10] || ''          // Column K (FOTO_GURU)
        };
      }
    }
    
    return null; // Teacher not found
    
  } catch (error) {
    console.error('Error getting teacher data:', error);
    return null;
  }
}

// Function to test the script
function testDoGet() {
  const e = {
    parameter: {
      sheet: 'INFO_SEKOLAH'
    }
  };
  
  const result = doGet(e);
  console.log(result.getContent());
}

// Function to test student login
function testStudentLogin() {
  const result = getStudentData('test_username', 'test_password');
  console.log('Student login test result:', result);
}

// Function to test teacher login
function testTeacherLogin() {
  const result = getTeacherData('test_username', 'test_password');
  console.log('Teacher login test result:', result);
}

// Function to list all sheets
function listAllSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = spreadsheet.getSheets();
  
  console.log('Available sheets:');
  sheets.forEach(sheet => {
    console.log('- ' + sheet.getName());
  });
}

// Function to check data structure
function checkDataStructure() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Check INFO_SEKOLAH
  console.log('=== INFO_SEKOLAH Structure ===');
  const infoSheet = spreadsheet.getSheetByName('INFO_SEKOLAH');
  if (infoSheet) {
    const infoRange = infoSheet.getRange('A1:D2');
    const infoValues = infoRange.getValues();
    console.log('Headers:', infoValues[0]);
    console.log('Data:', infoValues[1]);
  } else {
    console.log('INFO_SEKOLAH sheet not found');
  }
  
  // Check DATA_SISWA
  console.log('\n=== DATA_SISWA Structure ===');
  const siswaSheet = spreadsheet.getSheetByName('DATA_SISWA');
  if (siswaSheet) {
    const siswaRange = siswaSheet.getRange('A1:M2');
    const siswaValues = siswaRange.getValues();
    console.log('Headers:', siswaValues[0]);
    if (siswaValues[1]) {
      console.log('Sample Data:', siswaValues[1]);
    }
  } else {
    console.log('DATA_SISWA sheet not found');
  }
  
  // Check DATA_GURU
  console.log('\n=== DATA_GURU Structure ===');
  const guruSheet = spreadsheet.getSheetByName('DATA_GURU');
  if (guruSheet) {
    const guruRange = guruSheet.getRange('A1:K2');
    const guruValues = guruRange.getValues();
    console.log('Headers:', guruValues[0]);
    if (guruValues[1]) {
      console.log('Sample Data:', guruValues[1]);
    }
  } else {
    console.log('DATA_GURU sheet not found');
  }
}

// Function to get specific sheet data as CSV
function getSheetAsCSV(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return 'Sheet not found: ' + sheetName;
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    let csvContent = '';
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const csvRow = row.map(cell => {
        let cellValue = String(cell || '');
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          cellValue = '"' + cellValue.replace(/"/g, '""') + '"';
        }
        return cellValue;
      }).join(',');
      csvContent += csvRow + '\n';
    }
    
    return csvContent;
    
  } catch (error) {
    return 'Error: ' + error.toString();
  }
}