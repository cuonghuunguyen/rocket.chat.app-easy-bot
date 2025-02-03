import { IBotReply } from "../types";

export const mockResponse: IBotReply = {
	greeting: [
		{
			text: {
				en: "Hi! I'm Multiple Choice Bot. In English",
				ar: "Hi! I'm Multiple Choice Bot. In Arabic"
			}
		},
		{
			text: {
				en: "Click one:",
				ar: "اضغط على واحد:"
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
						en: "Change Language",
						ar: "تغيير اللغة"
					}
				}
			]
		}
	],
	selectLanguage: [
		{
			text: {
				en: "Please select your language / يرجى اختيار لغتك.",
				ar: "Please select your language / يرجى اختيار لغتك."
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
			text: {
				en: "Click one:",
				ar: "اضغط على واحد:"
			},
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
			]
		}
	],
	decide: [
		{
			text: {
				en: "Choose wisely",
				ar: "اختر بحكمة"
			},
			buttons: [
				{
					title: "Yes",
					payload: "affirm"
				},
				{
					title: "No",
					payload: "deny"
				}
			]
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
				en: "Here is some available contact:",
				ar: "إليك بعض جهات الاتصال المتاحة:"
			}
		},
		{
			text: {
				en: `- *HR*\n  Working for us\n\n- *Administrator*\n  Find answers for all questions\n\n- *Development team*\n  Reporting bugs and system issues`,
				ar: `- *الموارد البشرية*\n  العمل معنا\n\n- *المسؤول*\n  العثور على إجابات لجميع الأسئلة\n\n- *فريق التطوير*\n  الإبلاغ عن الأخطاء والمشكلات في النظام`
			}
		}
	],
	"send-contact": [
		{
			text: {
				en: "Please contact **Cuong**",
				ar: "يرجى التواصل مع **Cuong**"
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
					ar: "مرحبًا بك في نجاح العملاء"
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
				reason: "You requested to close this room"
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
