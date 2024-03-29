export interface UserRoleData {
  userRole_Id: number;
  userRole_Name: string;
  usersCount:number
}

export interface ConsumablesData {
  consumable_Id: number;
  name: string;
  description: string;
  quantity: number;
}

export interface MedicalAidTypeData {
  medicalAidTypeId: number;
  medicalAidTypeName: string;
}




export interface BookingTypeData {
  id: number;
  name: string;
  description: string;
}
export interface SlotTypeData {
  slotType_Id: number;
  name: string;
}


export interface DocumentData {
  id: number;
  name: string;
  description: string;
  docPath: string;
}


export interface QuestionData {
  question_Id: any;
  question_Text: string;
}

export interface FeeTypeData {
  feeType_Id: number;
  feeType_Name: string;
  feeType_Description: string;

}

export interface AllergyData {
  allergy_Id: number;
  allergy_Name: string;
}

export interface SurveyData {
  survey_Id: number;
  survey_Name: string;
  startDate: Date;
  endDate: Date;
}

export interface FeeData {
  fee_Id: number;
  fee_Name: string;
  fee_Amount: string;
  feeType_Id: number;
  feeType_Name: string;
}

export interface TokenResponse {
  UserID: any;
  UserRole: string;
  UserFirstName: string;
  accessToken: string;
  refreshToken: string;
}

export interface TaskResponse {
  id: number;
  name: string;
  isCompleted: boolean;
  ts: Date;
}
export interface RefreshTokenRequest {
  userId: number;
  refreshToken: string;
}

export interface ErrorResponse {
  error: string;
  errorCode: string;
}

export interface iEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: string;
}

export interface Application {
  application_ID: number;
  application_Date: string;
  parentName: string;
  parentSurname: string;
  contactNumber: string;
  emailAddress: string;
  childName: string;
  childSurname: string;
  childSpecialNeeds: string;
  childSpecialNeedsDescription: string;
  childDateOfBirth: string;
  parentRelationship: string;
  applicationStatus: string;
}


export interface KeyValueType {
  id: number,
  name: string
}
