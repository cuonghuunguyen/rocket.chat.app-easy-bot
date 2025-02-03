import { IBotReply } from "../types";

export const testMockResponse: IBotReply = {
	greeting: [
		{
			text: {
				en: "Hi! I'm Multiple Choice Bot. In English",
				ar: "مرحبًا! أنا روبوت الاختيار المتعدد. باللغة العربية"
			}
		},
		{
			text: {
				en: "Click one:",
				ar: "اختر واحدًا:"
			},
			list: [
				{
					payload: "attachment",
					title: {
						en: "Send attachments",
						ar: "إرسال مرفقات"
					}
				},
				{
					payload: "contact",
					title: {
						en: "Support contacts",
						ar: "جهات الاتصال للدعم"
					}
				},
				{
					payload: "transferCustomerSuccess",
					title: {
						en: "Customer Success",
						ar: "نجاح العملاء"
					}
				},
				{
					payload: "transferEngineering",
					title: {
						en: "Engineering",
						ar: "الهندسة"
					}
				},
				{
					payload: "closeRoom",
					title: {
						en: "Close this room",
						ar: "إغلاق هذه الغرفة"
					}
				},
				{
					payload: "selectLanguage",
					title: {
						ar: "Change Language",
						en: "تغيير اللغة"
					}
				}
			]
		}
	],
	selectLanguage: [
		{
			text: {
				en: "Please select your language",
				ar: "يرجى اختيار لغتك"
			},
			buttons: [
				{
					title: "English",
					payload: "selectLanguageEnglish"
				},
				{
					title: "العربية",
					payload: "selectLanguageArabic"
				}
			]
		}
	],
	selectLanguageEnglish: [
		{
			selectLanguage: {
				language: "en"
			}
		}
	],
	selectLanguageArabic: [
		{
			selectLanguage: {
				language: "ar"
			}
		}
	],
	attachment: [
		{
			buttons: [
				{
					payload: "decide",
					title: {
						en: "Send Yes / No",
						ar: "إرسال نعم / لا"
					}
				},
				{
					payload: "image",
					title: {
						en: "Send Image",
						ar: "إرسال صورة"
					}
				}
			],
			text: {
				en: "Click one:",
				ar: "اختر واحدًا:"
			}
		}
	],
	decide: [
		{
			buttons: [
				{
					title: {
						en: "Yes",
						ar: "نعم"
					},
					payload: "affirm"
				},
				{
					title: {
						en: "No",
						ar: "لا"
					},
					payload: "deny"
				}
			],
			text: {
				en: "Choose wisely",
				ar: "اختر بحكمة"
			}
		}
	],
	image: [
		{
			image: "https://i.postimg.cc/zXc477Xf/image-removebg-preview-28.png"
		}
	],
	contact: [
		{
			text: {
				en: "Here are some available contacts:",
				ar: "إليك بعض جهات الاتصال المتاحة:"
			}
		},
		{
			text: {
				en: "- *HR* Working for us\n\n- *Administrator* Find answers for all questions\n\n- *Development team* Reporting bugs and system issues",
				ar: "- *الموارد البشرية* العمل معنا\n\n- *المسؤول* العثور على إجابات لكل الأسئلة\n\n- *فريق التطوير* الإبلاغ عن الأخطاء والمشكلات"
			}
		}
	],
	"send-contact": [
		{
			text: {
				en: "Please contact Cuong",
				ar: "يرجى الاتصال بـ Cuong"
			}
		}
	],
	transferEngineering: [
		{
			transfer: {
				department: "Engineering",
				fallbackDepartment: "Customer Success"
			}
		}
	],
	transferCustomerSuccess: [
		{
			transfer: {
				department: "Customer Success",
				welcomeMessage: {
					en: "Welcome to Customer Success",
					ar: "مرحبًا بكم في نجاح العملاء"
				}
			}
		}
	],
	closeRoom: [
		{
			text: {
				en: "Goodbye",
				ar: "مع السلامة"
			}
		},
		{
			close: {
				reason: {
					en: "You requested to close this room",
					ar: "لقد طلبت إغلاق هذه الغرفة"
				}
			}
		}
	],
	wrongSelection: [
		{
			text: {
				en: "Please select one of the answers below to continue!",
				ar: "يرجى اختيار أحد الإجابات أدناه للمتابعة!"
			}
		}
	]
};
