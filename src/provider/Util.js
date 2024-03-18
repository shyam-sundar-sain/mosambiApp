class Util {
  gender = [
    {id: 1, gender: 'Male', selected: false},
    {id: 2, gender: 'Female', selected: false},
    {id: 3, gender: 'Others', selected: false},
  ];

  blood_group = [
    {id: 1, blood_group: 'A+', selected: false},
    {id: 2, blood_group: 'A-', selected: false},
    {id: 3, blood_group: 'B+', selected: false},
    {id: 4, blood_group: 'B-', selected: false},
    {id: 5, blood_group: 'O+', selected: false},
    {id: 6, blood_group: 'O-', selected: false},
    {id: 7, blood_group: 'AB+', selected: false},
    {id: 8, blood_group: 'AB-', selected: false},
  ];

  getBloodByID = id =>
    this.blood_group.filter(i => i.id == id)[0]?.blood_group || '';
  getGenderByID = id => this.gender.filter(i => i.id == id)[0]?.gender || '';

  getStatusOfMyHistory = id => {
    switch (Number(id)) {
      case 1:
        return 'Pending';
      case 2:
        return 'Accepted';
      case 3:
        return 'Rejected';
      case 4:
        return 'Confirmed';

      default:
        return '';
    }
  };
}

export const utility = new Util();
