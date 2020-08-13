import { SlackMessageType } from '../../slack/enums/slack-message-type.enum';
import { Lead } from '../../lead/entities/lead.entity';
import { colorContactMessage, colorJobApplyMessage, colorNewUserMessage } from '../constants/colors.constants';
import { Applicant } from '../../jobs/entities/applicant.entity';
import { User } from '../../users/entities/user.entity';

function buildContactUsMessage(data: Lead) {
  return {
    text: '<!here> Someone sent a contact message.',
    attachments: [
      {
        color: colorContactMessage,
        fields: [
          {
            title: 'Name',
            value: data.fullName,
            short: true,
          },
          {
            title: 'Email',
            value: data.email,
            short: true
          },
          {
            title: 'Phone',
            value: data.phone,
            short: false
          },
          {
            title: 'Message',
            value: data.message,
            short: false
          },
          {
            title: 'Address',
            value: data.address,
            short: false
          },
          {
            title: 'Source found us',
            value: data.sourceFoundUs,
            short: false
          },
        ]
      }
    ]
  }
}

function buildJobApplyMessage(data: Applicant) {
  return {
    text: ' Someone apply for a open position.',
    attachments: [
      {
        color: colorJobApplyMessage,
        fields: [
          {
            title: 'Name',
            value: data.fullName,
            short: true
          },
          {
            title: 'Email',
            value: data.email,
            short: true
          },
          {
            title: 'Phone',
            value: data.phone,
            short: false
          },
          {
            title: 'Applied Job',
            value: data.job.title,
            short: false,
          },
        ]
      }
    ]
  }
}

function buildNewUserMessage(data: User) {
  return {
    text: '<!here> A new user has been registered.',
    attachments: [
      {
        color: colorNewUserMessage,
        fields: [
          {
            title: 'Name',
            value: `${data.firstName} ${data.lastName}`,
            short: true,
          },
          {
            title: 'Email',
            value: data.email,
            short: true,
          },
          {
            title: 'Phone',
            value: data.phone,
            short: false,
          },
          {
            title: 'Admin panel link',
            value: `${process.env.PRODUCTION_HOST}/admin/customers/${data.id}`,
            short: false,
          },
        ],
      },
    ],
  };
}

export function buildSlackMessage(type: SlackMessageType, body) {
  if (type === SlackMessageType.SendContactUsMessage) {
    return buildContactUsMessage(body);
  } else if (type === SlackMessageType.ApplyForJob) {
    return buildJobApplyMessage(body);
  } else if (type === SlackMessageType.NewUserRegistered) {
    return buildNewUserMessage(body);
  }
}
